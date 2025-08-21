import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../../utils/utils';   
import { ResErrorsSwitch } from '../../../utils/ErResSwitch';
import { userSessionsRepository } from '../UserSessionsRpository/userSessionsRepository';
import { SessionType } from '../Sessions_DTO/sessionsType';
import { tokenService } from '../../../infrastructure/tokenService';
import { JwtPayload } from 'jsonwebtoken';

export const deviceIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // console.log('deviceIdMiddleware: - ', req.params.deviceId, req.user!.id)
    const cookieName = 'refreshToken';
    const refreshToken = req.cookies[cookieName];

    const userToken = await tokenService.validateRefreshToken(refreshToken);
    // console.log('deviceIdMiddleware: userToken - ', userToken)

    const foundDevice = await userSessionsRepository._getSessionDeviceByIdRepository(String(req.params.deviceId))
    // console.log('deviceIdMiddleware: - foundDevice', foundDevice)
    if(!foundDevice){
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND)
    }
    if(String((userToken as JwtPayload).userId) !== String(((foundDevice as unknown) as SessionType & { userId: string }).userId)){
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION)
    }
    const foundSession = await userSessionsRepository._getSessionByUserIdRepository(String(req.user!.id), String(req.params.deviceId))

    if(foundSession){
        if(!foundSession){
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND)
        }

    }else{
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND)
    }
    return next();
}
 