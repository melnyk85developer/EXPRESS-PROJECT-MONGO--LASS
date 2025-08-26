import "reflect-metadata"
import { RequestHandler } from 'express';
import { ResErrorsSwitch } from '../../shared/utils/ErResSwitch';
import { INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
import { injectable } from 'inversify';
import { SecurityDeviceServices } from './securityDeviceService';
import { UserSessionsQueryRepository } from './UserSessionsRpository/userSessionQueryRepository';

@injectable()
export class SecurityController {
    constructor(
        // @inject(TYPES.SecurityDeviceServices)
        protected securityDeviceServices: SecurityDeviceServices,
        // @inject(TYPES.UserSessionsQueryRepository)
        protected userSessionsQueryRepository: UserSessionsQueryRepository
    ) { }
    getAllSessionsByUserId: RequestHandler = async (req, res) => {
        // @ts-ignore
        const sessions = await this.userSessionsQueryRepository.getAllSessionByUserIdRepository(String(req.user!.id));
        return SuccessfulResponse(
            res, 
            INTERNAL_STATUS_CODE.SUCCESS_CREATED_SESSIONS, 
            undefined, 
            sessions
        );
    };
    deleteAllSessions: RequestHandler = async (req, res) => {
        // @ts-ignore
        const isDeleteSessions = await this.securityDeviceServices.deleteAllSessionsServices(
            String(req.user!.id),
            (req as any).deviceId
        );
        if (isDeleteSessions.acknowledged === true) {
            return SuccessfulResponse(
                res, 
                INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS
            )
        }
        return ResErrorsSwitch(res, isDeleteSessions!.statusCode, isDeleteSessions!.message);
    };
    deleteSessionByDeviceId: RequestHandler = async (req, res) => {
        // @ts-ignore
        const isDeleteSession = await this.securityDeviceServices.deleteSessionByDeviceIdServices(String(req.user!.id), req.params.deviceId);
        if (isDeleteSession.acknowledged) {
            res.clearCookie('refreshToken', { httpOnly: true });
            return SuccessfulResponse(
                res, 
                INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID
            )
        }
        return ResErrorsSwitch(res, isDeleteSession!.statusCode, isDeleteSession!.message);
    };
}