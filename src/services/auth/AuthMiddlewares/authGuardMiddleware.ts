import {Response, Request, NextFunction} from 'express'
import { UserType, UserTypeDB } from '../../users/Users_DTO/userTypes';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';
import { SETTINGS } from '../../../settings';
import { authServices } from '../authServices';
import { ResErrorsSwitch } from '../../../shared/utils/ErResSwitch';
import { securityDeviceServices } from '../../usersSessions/securityDeviceService';
import { usersQueryRepository } from '../../users/UserRpository/usersQueryRepository';
import { JwtPayload } from 'jsonwebtoken';
import { tokenService } from '../../../shared/infrastructure/tokenService';

export const oldAuthGuardMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const fromUTF8ToBase64 = (code: string) => {
        const buff2 = Buffer.from(code, 'utf8')
        const codedAuth = buff2.toString('base64')
        return codedAuth
    }
    const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN)
    const auth = req.headers['authorization'] as string; 
    if(!auth || auth.slice(0, 6) !== 'Basic ' || auth.slice(6) !== codedAuth){
        return ResErrorsSwitch(res, HTTP_STATUSES.UNAUTHORIZED_401)
    }else{
        return next()
    }
}
export const authLoginMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const isUser = await authServices._isAuthServiceForMiddleware(req.body.loginOrEmail, req.body.password)
    if(isUser){
        (req as Request & { user: UserTypeDB }).user = isUser.user
        next()
        return
    }else{
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_PASSWORD_OR_EMAIL_MISSPELLED)
    }
}
export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const cookieName = 'refreshToken';
    const refreshToken = req.cookies[cookieName];

    const userToken = await tokenService.validateRefreshToken(refreshToken);

    if(userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN){
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN)
    }
    if(userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT){
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT)
    }
    if(userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT){
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT)
    }
    if(userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN){
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN)
    }

    if(userToken){
        const findToken = await tokenService.getRefreshTokenByTokenInBlackList(refreshToken);
        const foundDevice = await securityDeviceServices._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
        
        // console.log('findToken: - getRefreshTokenByTokenInBlackList', findToken)
        if(findToken || !foundDevice){
            // console.log('refreshTokenMiddleware: - BlackList', true)
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST)
        }else{
            // const user = await usersServices._getUserByIdRepo(String((userToken as JwtPayload).userId));
            // console.log('user1: - ', user1)
            const user = await usersQueryRepository.getUserByIdRepository(String((userToken as JwtPayload).userId));
            // console.log('refreshTokenMiddleware: user - ', user)
            if(!user){
                return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.NOT_FOUND)
            }
            (req as Request & { user: UserTypeDB }).user = user;
            
            next()
            return 
        }
    }else{
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN)
    }
}
export const accessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] as string;
    // console.log('accessTokenMiddleware: - authHeader', authHeader)
    if(typeof authHeader !== 'string' || !authHeader){
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED)
    }

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT;
    }
    const token = authHeader.split(' ')[1];

    if(!token || token.length < 10){
        return INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT;
    }

    const userToken = await tokenService.validateAccessToken(token);
    // console.log('accessTokenMiddlewareService userTokenId: - ', userToken)

    if(userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT){
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT)
    }
    if(userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT){
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT)
    }
    if(userToken === INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN){
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN)
    }
    // const user = await usersServices._getUserByIdRepo((token as JwtPayload).userId);
    const user = await usersQueryRepository.getUserByIdRepository((userToken as unknown as JwtPayload).userId);
    // console.log('user: - ', user.id)
    if(!user){
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.NOT_FOUND)
    }
    
    (req as Request & { user: UserTypeDB }).user = user;
    // (req as Request & { userId: string }).userId = user._id;
    next()
    return
}
export const sessionTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const cookieName = 'refreshToken';
    const refreshToken = req.cookies[cookieName];

    if(!req.cookies[cookieName]){
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT)
    }
    
    // console.log('sessionTokenMiddleware refreshToken: - ', refreshToken)
    const userToken = await tokenService.validateRefreshToken(refreshToken);
    // console.log('sessionTokenMiddleware: userToken - ', userToken)

    if((userToken as JwtPayload).deviceId === INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN){
        // console.log('sessionTokenMiddleware refreshToken: ', refreshToken)
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN)
    }

    (req as Request & { deviceId: string }).deviceId = (userToken as JwtPayload).deviceId

    return next()
}