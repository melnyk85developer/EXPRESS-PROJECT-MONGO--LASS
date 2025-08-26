import 'reflect-metadata';
import { Response, Request, NextFunction } from 'express'
import { UserType, UserTypeDB } from '../../users/Users_DTO/userTypes';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';
import { SETTINGS } from '../../../shared/settings';
import { ResErrorsSwitch } from '../../../shared/utils/ErResSwitch';
import { JwtPayload } from 'jsonwebtoken';
import { injectable } from 'inversify';
import { AuthServices } from '../authServices';
import { TokenService } from '../../../shared/infrastructure/tokenService';
import { SecurityDeviceServices } from '../../usersSessions/securityDeviceService';
import { UsersQueryRepository } from '../../users/UserRpository/usersQueryRepository';

@injectable()
export class AuthMiddlewares {
    constructor(
        // @inject(TYPES.AuthServices)
        private authServices: AuthServices,
        // @inject(TYPES.TokenService)
        private tokenService: TokenService,
        // @inject(TYPES.SecurityDeviceServices)
        private securityDeviceServices: SecurityDeviceServices,
        // @inject(TYPES.UsersQueryRepository)
        private usersQueryRepository: UsersQueryRepository
    ) { }
    oldAuthGuardMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const fromUTF8ToBase64 = (code: string) => {
            const buff2 = Buffer.from(code, 'utf8')
            const codedAuth = buff2.toString('base64')
            return codedAuth
        }
        const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN)
        const auth = req.headers['authorization'] as string;
        if (!auth || auth.slice(0, 6) !== 'Basic ' || auth.slice(6) !== codedAuth) {
            return ResErrorsSwitch(res, HTTP_STATUSES.UNAUTHORIZED_401)
        } else {
            return next()
        }
    }
    authLoginMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        // console.log('authLoginMiddleware: req.body.loginOrEmail, req.body.password 😡', req.body.loginOrEmail, req.body.password)
        const isUser = await this.authServices._isAuthServiceForMiddleware(req.body.loginOrEmail, req.body.password)
        if (isUser) {
            (req as Request & { user: UserTypeDB }).user = isUser.user
            next()
            return
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_PASSWORD_OR_EMAIL_MISSPELLED)
        }
    }
    refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const cookieName = 'refreshToken';
        const refreshToken = req.cookies[cookieName];

        const userToken = await this.tokenService.validateRefreshToken(refreshToken);

        if (userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN) {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN)
        }
        if (userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT) {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT)
        }
        if (userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT) {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT)
        }
        if (userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN) {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN)
        }

        if (userToken) {
            const findToken = await this.tokenService.getRefreshTokenByTokenInBlackList(refreshToken);
            const foundDevice = await this.securityDeviceServices._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));

            // console.log('findToken: - getRefreshTokenByTokenInBlackList', findToken)
            if (findToken || !foundDevice) {
                // console.log('refreshTokenMiddleware: - BlackList', true)
                return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST)
            } else {
                // const user = await usersServices._getUserByIdRepo(String((userToken as JwtPayload).userId));
                // console.log('user1: - ', user1)
                const user = await this.usersQueryRepository.getUserByIdRepository(String((userToken as JwtPayload).userId));
                // console.log('refreshTokenMiddleware: user - ', user)
                if (!user) {
                    return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.NOT_FOUND)
                }
                (req as Request & { user: UserTypeDB }).user = user;

                next()
                return
            }
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN)
        }
    }
    accessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization'] as string;
        // console.log('accessTokenMiddleware: - authHeader', authHeader)
        if (typeof authHeader !== 'string' || !authHeader) {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED)
        }

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT;
        }
        const token = authHeader.split(' ')[1];

        if (!token || token.length < 10) {
            return INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT;
        }

        const userToken = await this.tokenService.validateAccessToken(token);
        // console.log('accessTokenMiddlewareService userTokenId: - ', userToken)

        if (userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT) {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT)
        }
        if (userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT) {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT)
        }
        if (userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN) {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN)
        }
        // const user = await usersServices._getUserByIdRepo((token as JwtPayload).userId);
        const user = await this.usersQueryRepository.getUserByIdRepository((userToken as unknown as JwtPayload).userId);
        // console.log('user: - ', user.id)
        if (!user) {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.NOT_FOUND)
        }

        (req as Request & { user: UserTypeDB }).user = user;
        // (req as Request & { userId: string }).userId = user._id;
        next()
        return
    }
    sessionTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const cookieName = 'refreshToken';
        const refreshToken = req.cookies[cookieName];

        if (!req.cookies[cookieName]) {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT)
        }

        // console.log('sessionTokenMiddleware refreshToken: - ', refreshToken)
        const userToken = await this.tokenService.validateRefreshToken(refreshToken);
        // console.log('sessionTokenMiddleware: userToken - ', userToken)

        if ((userToken as JwtPayload).deviceId === INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN) {
            // console.log('sessionTokenMiddleware refreshToken: ', refreshToken)
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN)
        }

        (req as Request & { deviceId: string }).deviceId = (userToken as JwtPayload).deviceId

        return next()
    }
}