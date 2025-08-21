import express, { Request, Response } from 'express';
import { accessTokenMiddleware, refreshTokenMiddleware, sessionTokenMiddleware } from '../auth/AuthMiddlewares/authGuardMiddleware';
import { ResErrorsSwitch } from '../../utils/ErResSwitch';
import { INTERNAL_STATUS_CODE } from '../../utils/utils';
import { SuccessfulResponse } from '../../utils/SuccessfulResponse';
import { secutityDeviceServices } from './secutityDeviceService';
import { deviceIdMiddleware } from './userSessionsMiddlewares/isThereASessionValidation';
import { userSessionsQueryRepository } from './UserSessionsRpository/userSessionQueryRepository';
import { userSessionsRepository } from './UserSessionsRpository/userSessionsRepository';
import { SessionType } from './Sessions_DTO/sessionsType';
import { tokenService } from '../../infrastructure/tokenService';

export const secutityControllers = (): express.Router => {
    const router = express.Router();
    router.get(`/devices`, 
        // accessTokenMiddleware,
        refreshTokenMiddleware,
        sessionTokenMiddleware,
        // protectedRequestLimitMiddleware,
        async (req: Request, res: Response) => {
            // @ts-ignore
            // console.log('secutityControllers: - getAlldevices', String(req.user!.id), req.deviceId)
        const sessions = await userSessionsQueryRepository.getAllSessionByUserIdRepository(String(req.user!.id));
        // console.log('secutityControllers: - sessions', sessions)
        return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_SESSIONS, undefined, sessions)
    });
    router.delete(`/devices`, 
        // accessTokenMiddleware,
        refreshTokenMiddleware,
        sessionTokenMiddleware,
        // protectedRequestLimitMiddleware,
        async (req: Request, res: Response) => {
        // @ts-ignore
        const isDeleteSessions = await secutityDeviceServices.deleteAllSessionsServices(
            String(req.user!.id),  
            (req as Request & { deviceId: string }).deviceId
        );
        if(isDeleteSessions.acknowledged === true){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS)
        }else{
            return ResErrorsSwitch(res, isDeleteSessions!.statusCode, isDeleteSessions!.message)
        }
    });
    router.delete(`/devices/:deviceId`, 
        // accessTokenMiddleware,
        refreshTokenMiddleware,
        sessionTokenMiddleware,
        deviceIdMiddleware,
        // protectedRequestLimitMiddleware,
        async (req: Request, res: Response) => {
        const isDeleteSession = await secutityDeviceServices.deleteSessionByDeviceIdServices(
            // @ts-ignore
            String(req.user!.id), 
            req.params.deviceId,
        );
        if(isDeleteSession.acknowledged){
            res.clearCookie('refreshToken', { httpOnly: true });
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID)
        }else{
            return ResErrorsSwitch(res, isDeleteSession!.statusCode, isDeleteSession!.message)
        }
    });

    // router.get(`/devices-all`, 
    //     accessTokenMiddleware,
    //     sessionTokenMiddleware,
    //     async (req: Request, res: Response) => {
    //     const sessions = await userSessionsRepository._getAllSessionyUsersRepository()
    //     return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_SESSIONS, undefined, sessions)
    // });
    return router;
};