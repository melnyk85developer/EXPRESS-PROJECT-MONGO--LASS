import bcrypt from 'bcrypt';
import { add } from "date-fns";
import * as uuid from 'uuid';
import { ObjectId, UpdateResult } from "mongodb";
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { UserType, UserTypeDB } from '../users/Users_DTO/userTypes';
import { JwtPayload } from 'jsonwebtoken';
import { MailService } from '../../shared/infrastructure/emailAdapter';
import { inject, injectable } from 'inversify';
import { UserService } from '../users/usersServices';
import { UsersRepository } from '../users/UserRpository/usersRepository';
import { UsersQueryRepository } from '../users/UserRpository/usersQueryRepository';
import { SecurityDeviceServices } from '../usersSessions/securityDeviceService';
import { TokenService } from '../../shared/infrastructure/tokenService';
import { MongoDBCollection } from '../../db';
import { ConfirmationRepository } from '../confirmation/confirmationRepository/confirmationRepository';

@injectable()
export class AuthServices {
    constructor(
        @inject(MongoDBCollection) private mongoDB: MongoDBCollection,
        @inject(UserService) private usersServices: UserService,
        @inject(TokenService) private tokenService: TokenService,
        @inject(MailService) private mailService: MailService,
        @inject(UsersRepository) private usersRepository: UsersRepository,
        @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
        @inject(SecurityDeviceServices) private securityDeviceServices: SecurityDeviceServices,
        @inject(ConfirmationRepository) private myConfirmationRepository: ConfirmationRepository,
    ) { }
    async registrationServices(login: string, password: string, email: string): Promise<UserType | null | any> {
        // console.log('registrationServices - login, password, email 😡😡', login, password, email)
        const isLogin = await this.usersServices._getUserByLoginOrEmailService(login)
        // console.log('registrationServices - isLogin: ', isLogin)
        const isEmail = await this.usersServices._getUserByLoginOrEmailService(email)
        // console.log('registrationServices - isLogin, isEmail: ', isLogin, isEmail)
        if (!isLogin && !isEmail) {
            // console.log('😡 !isLogin && !isEmail)')
            const date = new Date()
            // date.setMilliseconds(0)
            const confirmationCode = uuid.v4()
            const createdAt = date.toISOString()
            const createUser = {
                accountData: {
                    userName: login,
                    email,
                    password: password,
                    createdAt: createdAt
                }
            }
            const crestedUser = await this.usersServices.createUserServices(createUser as unknown as UserTypeDB)
            // console.log('crestedUser: - 😡', crestedUser)
            await this.myConfirmationRepository.createConfirmationRepository({
                confirmationCode: confirmationCode,
                expirationDate: add(new Date(), {
                    // hours: 1,
                    minutes: 3
                }),
                isBlocked: true,
                field: 'registration',
                userId: crestedUser.insertedId,
            })
            const from = `IT-INCUBATOR <${process.env.SMTP_USER}>`
            const to = email
            const subject = `Активация аккаунта на сайте ${process.env.PROJEKT_NAME}`
            const text = confirmationCode
            const html =
                `<div>
                <h1>Для активации аккаунта на сайте ${process.env.PROJEKT_NAME} перейдите по ссылке</h1>
                <h2>${confirmationCode}</h2>
                <p>
                    To finish registration please follow the link below:
                    <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Подтвердить регистрацию</a>
                </p>
                <button>
                    <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Подтвердить регистрацию</a>
                </button>
            </div>`
            const isSend = this.mailService.sendMail(from, to, subject, text, html)
                .catch(() => console.log('Ошибка отправки сообщения на E-Mail'))
            if (!isSend) {
                if (crestedUser.insertedId) {
                    await this.usersServices.deleteUserServices(crestedUser.insertedId.toString())
                }
                return null
            }
            return crestedUser
        }
        if (isEmail) {
            return INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_EMAIL_ALREADY_EXISTS
        }
        if (isLogin) {
            return INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_LOGIN_ALREADY_EXISTS
        }
    }
    async loginServices(userId: string, ip: string, userAgent: string): Promise<any> {
        const session = await this.securityDeviceServices.createSessionServices(userId, ip, userAgent)
        return session
    }
    async logoutServices(userId: string, refreshToken: string): Promise<any> {
        const userToken = await this.tokenService.validateRefreshToken(refreshToken);
        const session = await this.securityDeviceServices.deleteSessionByDeviceIdServices(
            userId,
            (userToken! as JwtPayload & { deviceId: string }).deviceId
        )
        const isSaveRefreshTokenBlackList = await this.tokenService.saveRefreshTokenBlackList(
            userId,
            refreshToken
        );
        if (session.acknowledged && isSaveRefreshTokenBlackList.acknowledged) {
            return session.acknowledged
        } else {
            return INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST
        }
    }
    async refreshTokenOrSessionService(ip: string, userAgent: string, userId: string, refreshToken: string): Promise<{ accessToken: string, refreshToken: string } | any> {

        const isSessionExpired = (expirationDate: string): boolean => {
            const currentDate = new Date().toISOString();
            return Number(expirationDate) < Number(currentDate);
        };
        const userToken = await this.tokenService.validateRefreshToken(refreshToken);

        if (!userToken) { return INTERNAL_STATUS_CODE.REFRESH_TOKEN_VALIDATION_ERROR }

        const device = await this.securityDeviceServices._getSessionByDeviceIdServices(
            (userToken as JwtPayload & { deviceId: string }).deviceId
        )
        if (!device) { return INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND }

        // if(userAgent !== device){
        //     console.error('Нарушена безопасность: userAgent !== device !!! Это означает, что произошла смена устройства при обновлении токена!')
        // }

        const noExpSession = !isSessionExpired(device.expirationDate)
        // console.log('refreshTokenOrSessionService: - noExpSession', noExpSession)
        // console.log('refreshTokenOrSessionService: - device.lastActiveDate IF', device.lastActiveDate === new Date((userToken! as JwtPayload & { iat: number }).iat).toISOString())

        if (noExpSession && device.lastActiveDate === new Date((userToken! as JwtPayload & { iat: number }).iat).toISOString()) {

            const isSaveRefreshTokenBlackList = await this.tokenService.saveRefreshTokenBlackList(
                userId,
                refreshToken
            )
            if (isSaveRefreshTokenBlackList.acknowledged) {
                const isUpdatedSession = await this.securityDeviceServices.updateSessionServices(
                    userId,
                    ip,
                    userAgent,
                    String((userToken as JwtPayload & { deviceId: string }).deviceId)
                )
                if (isUpdatedSession) {
                    return isUpdatedSession
                } else {
                    return null
                }
            } else {
                return INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST
            }
        } else {
            return INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN
        }
    }
    async confirmEmail(code: any): Promise<boolean> {
        let user = await this.usersServices._findUserByConfirmationCodeService(code)
        if (!user) return false
        if (user.emailConfirmation.isConfirmed) return false
        if (user.emailConfirmation.confirmationCode !== code) return false
        const expirationDate = new Date(user.emailConfirmation.expirationDate)
        const currentDate = new Date()
        if (expirationDate < currentDate) return false
        return await this.usersRepository.updateConfirmationUserRepository(user._id)
    }
    async emailResending(email: any): Promise<UpdateResult<{ acknowledged: boolean; insertedId: number; }> | null | boolean> {
        const confirmationCode = uuid.v4()
        const from = `IT-INCUBATOR <${process.env.SMTP_USER}>`
        const to = email
        const subject = `Повторный запрос на активацию аккаунта на сайте ${process.env.PROJEKT_NAME}`
        const text = confirmationCode
        const html = `
        <div>
            <h1>Для активации аккаунта на сайте ${process.env.PROJEKT_NAME} перейдите по ссылке!!!
            Если Вы не инициировали запрос на повторную активацию аккаунта на сайте ${process.env.PROJEKT_NAME}, 
            то немедленно заблокируйте эти попытки злоумышленников!</h1>
            <h2>${confirmationCode}</h2>
            <p>
                To finish registration please follow the link below:
                <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Подтвердить регистрацию</a>
            </p>
            <button>
                <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Подтвердить регистрацию</a>
            </button>
            <button>
                <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Заблокировать</a>
            </button>
        </div>`
        const getUser = await this.usersServices._getUserByEmailService(email)
        if (!getUser) return null
        if (getUser.emailConfirmation.isConfirmed) return null
        const isSend = this.mailService.sendMail(from, to, subject, text, html)
            .catch(() => console.log('Ошибка отправки сообщения на E-Mail'))
        if (!isSend) return null
        return await this.usersServices.updateResendingUserServices(String(getUser._id), confirmationCode as unknown as any)

    }
    async me(userId: string): Promise<any> {
        try {
            const getUser = await this.mongoDB.usersCollection.findOne({ _id: new ObjectId(userId) })
            if (getUser) {
                const userInfo = this.usersQueryRepository._userMapForRender(getUser)
                return {
                    email: userInfo.email,
                    login: userInfo.login,
                    userId: userInfo.id
                }
            }
        } catch (e) {
            console.error(e)
            return null
        }
    }
    async _isAuthServiceForMiddleware(loginOrEmail: string, password: string): Promise<any> {
        const user = await this.usersServices._getUserByLoginOrEmailService(loginOrEmail);
        if (!user) return null
        // TODO Написать смс: Активируйте аккаунт!
        // if(!user.emailConfirmation.isConfirmed) return null
        const isPasswordValid = await bcrypt.compare(
            password,
            user.accountData.password
        );
        if (isPasswordValid) {
            return { user };
        } else {
            return null;
        }
    }
}