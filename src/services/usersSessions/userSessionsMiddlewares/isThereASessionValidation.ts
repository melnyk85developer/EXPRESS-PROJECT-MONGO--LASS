import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';
import { ErRes } from '../../../shared/utils/ErRes';
import { SessionType } from '../Sessions_DTO/sessionsType';
import { JwtPayload } from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { UserSessionsRepository } from '../UserSessionsRpository/userSessionsRepository';
import { TokenService } from '../../../shared/infrastructure/tokenService';

@injectable()
export class SessionsMiddlewares {
    constructor(
        @inject(UserSessionsRepository) private userSessionsRepository: UserSessionsRepository,
        @inject(TokenService) private tokenService: TokenService,
    ) { }

    deviceIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        // console.log('deviceIdMiddleware: - ', req.params.deviceId, req.user!.id)
        const cookieName = 'refreshToken';
        const refreshToken = req.cookies[cookieName];

        const userToken = await this.tokenService.validateRefreshToken(refreshToken);
        // console.log('deviceIdMiddleware: userToken - ', userToken)

        const foundDevice = await this.userSessionsRepository._getSessionDeviceByIdRepository(String(req.params.deviceId))
        // console.log('deviceIdMiddleware: - foundDevice', foundDevice)
        if (!foundDevice) {
            return new ErRes(
                INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND,
                undefined,
                undefined,
                req,
                res
            )
        }
        if (String((userToken as JwtPayload).userId) !== String(((foundDevice as unknown) as SessionType & { userId: string }).userId)) {
            return new ErRes(
                INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION,
                undefined,
                undefined,
                req,
                res
            )
        }
        const foundSession = await this.userSessionsRepository._getSessionByUserIdRepository(String(req.user!.id), String(req.params.deviceId))

        if (foundSession) {
            if (!foundSession) {
                return new ErRes(
                    INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND,
                    undefined,
                    undefined,
                    req,
                    res
                )
            }

        } else {
            return new ErRes(
                INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND,
                undefined,
                undefined,
                req,
                res
            )
        }
        return next();
    }
}
