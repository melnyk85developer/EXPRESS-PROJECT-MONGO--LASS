import * as bcrypt from 'bcryptjs'
import * as uuid from 'uuid';
import { DeleteResult, InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { UpdateUserModel } from "./Users_DTO/UpdateUserModel";
import { UserTypeDB } from "./Users_DTO/userTypes";
import { inject, injectable } from "inversify";
import { UsersRepository } from "./UserRpository/usersRepository";
import { UsersQueryRepository } from "./UserRpository/usersQueryRepository";
import { INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { ErRes } from '../../shared/utils/ErRes';
import { ConfirmationRepository } from '../confirmation/confirmationRepository/confirmationRepository';
import { add } from 'date-fns';
import { resetPasswordEmailMessageHTMLDocument } from '../../shared/infrastructure/resetPasswordEmailMessage.HTML';
import { MailService } from '../../shared/infrastructure/emailAdapter';

@injectable()
export class UserService {
    constructor(
        @inject(UsersRepository) private usersRepository: UsersRepository,
        @inject(MailService) private mailService: MailService,
        @inject(ConfirmationRepository) private myConfirmationRepository: ConfirmationRepository,
    ) { }

    async createUserServices(user: any): Promise<InsertOneResult<{ acknowledged: boolean, insertedId: number }> | any> {
        const { accountData, confirmations } = user
        if (accountData.userName && accountData.password && accountData.email) {
            let createUser = new UserTypeDB(
                new ObjectId(),
                {
                    userName: accountData.userName,
                    email: accountData.email,
                    password: await bcrypt.hash(accountData.password, 10),
                    createdAt: accountData.createdAt
                }
            )
            return await this.usersRepository.createUserRepository(createUser as unknown as any)
        }
    }
    async updateUserServices(id: string, body: UpdateUserModel): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number }> | null> {
        const updatedUser = {
            login: body.login,
            email: body.email
        }
        return await this.usersRepository.updateUserRepository(id, updatedUser)
    }
    async updateResendingUserServices(id: string, confirmationCode: string): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number }> | null> {
        return await this.usersRepository.updateResendingUserRepository(id, confirmationCode)
    }
    async deleteUserServices(id: string): Promise<DeleteResult | null> {
        return await this.usersRepository.deleteUserRepository(id)
    }
    async ressetPasswordService(email: any): Promise<{ status: number, expirationDate: string } | any> {
        // console.log('UserService: - ressetPasswordService email', email)
        const confirmationCode = uuid.v4()
        const user = await this._getUserByEmailService(email)
        if (user && user._id) {
            // console.log('UserService: - ressetPasswordService user', user)
            const confirmPassword = user.confirmations.filter((i: { field: string; }) => i.field === 'password')
            if (user.confirmations.length > 0 && confirmPassword) {
                console.log('UserService: - ressetPasswordService confirmPassword', confirmPassword)
                if (confirmPassword) {
                    let block = user.confirmations.filter((i: { isBlocked: boolean; field: string; }) => i.isBlocked === true && i.field === 'password')
                    if (block.length) {
                        console.log('ressetPasswordService blocked length: ', block.length)
                        for (let i = 0; block.length > i; i++) {
                            const confirmation = user.confirmations[i]
                            if (new Date < confirmation.expirationDate && block[i].field === 'password' && block[i].isBlocked === true) {
                                console.log('UsersService ressetPasswordService: - Блокировка не пустила - время не прошло в сбросе пароля!', confirmation.expirationDate)
                                return {
                                    status: INTERNAL_STATUS_CODE.BAD_REQUEST_FUNCTION_BLOCKED,
                                    expirationDate: confirmation.expirationDate.toISOString()
                                }
                            } else {
                                const confirmation = user.confirmations[i]
                                if (new Date > confirmation.expirationDate && user.confirmations[i].field === 'password') {
                                    console.log('UsersService ressetPasswordService: - Блокировку удаляем - время закончилось в сбросе пароля!', confirmation.expirationDate)
                                    const deleteBlock = block[i]
                                    await this.myConfirmationRepository.deleteConfirmationIdRepository(deleteBlock.id);
                                }
                            }
                        }
                    }
                    const confirmations = user.confirmations.filter((c: { field: string; isBlocked: boolean; }) => c.field === 'password' && c.isBlocked === false)
                    if (confirmations && confirmations.length > 0) {
                        console.log('ressetPasswordService: - confirmations', user.confirmations)
                        for (let i = 0; confirmations.length > i; i++) {
                            if (new Date < confirmations[i].expirationDate) {
                                console.log('UsersService ressetPasswordService: - 3 минуты не прошло!', confirmations[i].expirationDate)
                                return {
                                    status: INTERNAL_STATUS_CODE.BAD_REQUEST_TIME_HASNT_PASSED_YET,
                                    expirationDate: confirmations[i].expirationDate.toISOString()
                                }
                            }
                        }
                    }
                    console.log('confirmations.length : - ', confirmations)
                    if (confirmPassword.length > 3) {
                        console.log('UsersService ressetPasswordService: - Блокировка сброса пароля - при частых отправках сообщения на E-Mail', user.confirmation.length)
                        const confirTime = confirmPassword.filter((i: { expirationDate: string | number | Date; }) => {
                            const expirationDate = new Date(i.expirationDate).getTime();
                            const fifteenMinutesAgo = Date.now() - 18 * 60 * 1000; // 18 минут назад
                            return expirationDate > fifteenMinutesAgo; // проверка, что время не прошло 18 минут
                        })
                        console.log('UsersService ressetPasswordService: - confirTime.length', confirTime.length);
                        // Если за последние 18 минут было более 5 запросов, блокируем
                        if (confirTime.length >= 5 && confirmPassword[confirmPassword.length - 1].isBlocked === false) {
                            console.log('UsersService ressetPasswordService: - Блокировка Resset password!', confirTime.length);
                            const clearConfir = user.confirmations.filter((i: { isBlocked: boolean; field: string; }) => i.isBlocked === false && i.field === 'password')
                            for (let i = 0; clearConfir.length > i; i++) {
                                await this.myConfirmationRepository.deleteConfirmationIdRepository(clearConfir[i].id);
                            }
                            const expirationDate = await this.myConfirmationRepository.createConfirmationRepository({
                                confirmationCode: confirmationCode,
                                expirationDate: add(new Date(), {
                                    minutes: 40
                                }),
                                isBlocked: true,
                                field: 'password',
                                userId: user._id,
                            })
                            return {
                                status: INTERNAL_STATUS_CODE.BAD_REQUEST_A_LOT_OF_REQUESTS_TRY_AGAIN_LATER,
                                expirationDate: expirationDate.expirationDate.toISOString()
                            }
                        }
                    }
                    console.log('confirmations: - ', confirmations)
                }
            }
            const nameProjekt = `<span style="margin: -2px 0 0 0; color: #FEA930; font-size: 18px;">Web</span><span style="margin: -2px 0 0 0; color: #15c; font-size: 18px;">Mars</span>`
            const from = `${process.env.PROJEKT_NAME}<${process.env.SMTP_USER}>`
            const to = email
            const subject = `Сброс пароля на проекте ${process.env.PROJEKT_NAME}`
            const text = confirmationCode
            const html = resetPasswordEmailMessageHTMLDocument(nameProjekt, to, text, `${process.env.CLIENT_URL}/newpassword?code=${confirmationCode}`, user)

            const isSendEmail = this.mailService.sendMail(from, to, subject, text, html)
                .catch(() => console.log(`
                Упс, что-то пошло не так во время отправки сообщения на E-Mail: ${email}. Возможно сервис отправки 
                писем перегружен, просим Вас повторить запрос чуть позже.`))

            const expirationDate = await this.myConfirmationRepository.createConfirmationRepository({
                confirmationCode: confirmationCode,
                expirationDate: add(new Date(), {
                    minutes: 3
                }),
                isBlocked: false,
                field: 'password',
                userId: user._id,
            })
            // console.log('UsersService ressetPasswordService: - expirationDate', expirationDate)
            if (expirationDate && expirationDate.acknowledged) {
                const confirmation = await this.myConfirmationRepository.findConfirmationByIdRepository(expirationDate.insertedId)
                if (!confirmation) {
                    return null
                }
                // console.log('UsersService ressetPasswordService: - expirationDate res 200', expirationDate)
                console.log('UsersService ressetPasswordService: - confirmation res 200', confirmation)
                return {
                    status: INTERNAL_STATUS_CODE.SUCCESS,
                    expirationDate: confirmation.expirationDate.toISOString()
                }
                // throw new ErRes(INTERNAL_STATUS_CODE.SUCCESS, expirationDate.expirationDate.toISOString())
            } else {
                console.log('UNPROCESSABLE_ENTITY: - isSendEmail', isSendEmail)
                return INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY
            }
        } else if (user === INTERNAL_STATUS_CODE.USER_NOT_FOUND) {
            return { status: INTERNAL_STATUS_CODE.USER_NOT_FOUND, expirationDate: '' }
        } else {
            return { status: INTERNAL_STATUS_CODE.NOT_FOUND, expirationDate: '' }
        }
    }
    async updatePasswordService(password: string, code: string): Promise<ObjectId | null | number> {
        const hashPassword = await bcrypt.hash(password, 10)
        const passwordConfirmationByCode = await this.myConfirmationRepository.findByCodeConfirmationRepository(code)
        if (passwordConfirmationByCode) {
            // console.log('updatePasswordService: - passwordConfirmationByCode', passwordConfirmationByCode)
            const isUser = await this._getUserByIdService(passwordConfirmationByCode.userId)
            if (isUser && isUser.confirmations.length) {
                const confirmations = isUser.confirmations[isUser.confirmation.length - 1]
                if (new Date > confirmations.expirationDate) {
                    // console.log('UsersService confirmationCode: - Код протух: ', confirmation.expirationDate)
                    return INTERNAL_STATUS_CODE.BAD_REQUEST_EXPIRATION_TIME_PASSED
                } else {
                    return await this.usersRepository.updatePasswordRepository(hashPassword, isUser.userId)
                }
            } else {
                return INTERNAL_STATUS_CODE.NOT_FOUND
            }
        } else {
            return INTERNAL_STATUS_CODE.NOT_FOUND
        }
    }

    async _getUserByIdService(id: string): Promise<UserTypeDB | any> {
        return await this.usersRepository._getUserByIdRepository(id)
    }
    async _getUserByLoginOrEmailService(loginOrEmail: string): Promise<UserTypeDB | any> {
        // console.log('UserService - loginOrEmail 😡😡', loginOrEmail)
        return await this.usersRepository._getUserByLoginOrEmailRepository(loginOrEmail)
    }
    async _getUserByEmailService(email: string): Promise<UserTypeDB | any> {
        const user = await this.usersRepository._getUserByEmailRepository(email)
        if (!user) {
            return INTERNAL_STATUS_CODE.USER_NOT_FOUND
        }
        // console.log('UserService: - _getUserByEmailService user', user)
        const confirmations = await this.myConfirmationRepository.findByUserIdConfirmationRepository(user._id)
        if (!confirmations) {
            return null
        }
        // console.log('UserService: - _getUserByEmailService confirmations', confirmations)
        return {
            ...user,
            confirmations
        }
    }
    async _findUserByConfirmationCodeService(code: string): Promise<UserTypeDB | any> {
        return this.usersRepository._findUserByConfirmationCodeRepository(code)
    }
}