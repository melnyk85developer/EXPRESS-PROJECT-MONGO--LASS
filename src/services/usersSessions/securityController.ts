import { RequestHandler } from 'express';
import { ErRes } from '../../shared/utils/ErRes';
import { INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { inject, injectable } from 'inversify';
import { SecurityDeviceServices } from './securityDeviceService';
import { UserSessionsQueryRepository } from './UserSessionsRpository/userSessionQueryRepository';
import { SuccessResponse } from '../../shared/utils/SuccessResponse';

@injectable()
export class SecurityController {
    constructor(
        @inject(SecurityDeviceServices) protected securityDeviceServices: SecurityDeviceServices,
        @inject(UserSessionsQueryRepository) protected userSessionsQueryRepository: UserSessionsQueryRepository
    ) { }
    getAllSessionsByUserId: RequestHandler = async (req, res) => {
        // @ts-ignore
        const sessions = await this.userSessionsQueryRepository.getAllSessionByUserIdRepository(String(req.user!.id));
        return SuccessResponse(
            INTERNAL_STATUS_CODE.SUCCESS_CREATED_SESSIONS,
            sessions,
            undefined,
            req,
            res
        );
    };
    deleteAllSessions: RequestHandler = async (req, res) => {
        // @ts-ignore
        const isDeleteSessions = await this.securityDeviceServices.deleteAllSessionsServices(
            String(req.user!.id),
            (req as any).deviceId
        );
        if (isDeleteSessions.acknowledged === true) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS,
                undefined,
                undefined,
                req,
                res
            )
        }
        return new ErRes(
            isDeleteSessions!.statusCode,
            undefined,
            isDeleteSessions!.message,
            req,
            res
        );
    };
    deleteSessionByDeviceId: RequestHandler = async (req, res) => {
        // @ts-ignore
        const isDeleteSession = await this.securityDeviceServices.deleteSessionByDeviceIdServices(String(req.user!.id), req.params.deviceId);
        if (isDeleteSession.acknowledged) {
            res.clearCookie('refreshToken', { httpOnly: true });
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID,
                undefined,
                undefined,
                req,
                res
            )
        }
        return new ErRes(
            isDeleteSession!.statusCode,
            undefined,
            isDeleteSession!.message,
            req,
            res
        );
    };
}