import express, { Request, RequestHandler, Response } from 'express';
import { ResErrorsSwitch } from '../../shared/utils/ErResSwitch';
import { INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
import { securityDeviceServices } from './securityDeviceService';
import { userSessionsQueryRepository } from './UserSessionsRpository/userSessionQueryRepository';

export class SecurityController {
    getAllSessionsByUserId: RequestHandler = async (req, res) => {
        // @ts-ignore
        const sessions = await userSessionsQueryRepository.getAllSessionByUserIdRepository(String(req.user!.id));
        return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_SESSIONS, undefined, sessions);
    };
    deleteAllSessions: RequestHandler = async (req, res) => {
        // @ts-ignore
        const isDeleteSessions = await securityDeviceServices.deleteAllSessionsServices(
            String(req.user!.id),
            (req as any).deviceId
        );
        if (isDeleteSessions.acknowledged === true) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS);
        }
        return ResErrorsSwitch(res, isDeleteSessions!.statusCode, isDeleteSessions!.message);
    };
    deleteSessionByDeviceId: RequestHandler = async (req, res) => {
        // @ts-ignore
        const isDeleteSession = await securityDeviceServices.deleteSessionByDeviceIdServices(String(req.user!.id), req.params.deviceId);
        if (isDeleteSession.acknowledged) {
            res.clearCookie('refreshToken', { httpOnly: true });
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID);
        }
        return ResErrorsSwitch(res, isDeleteSession!.statusCode, isDeleteSession!.message);
    };
}
export const securityController = new SecurityController();