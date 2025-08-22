import express, { Response } from 'express';
import { securityController } from './securityController';
import { refreshTokenMiddleware, sessionTokenMiddleware } from '../auth/AuthMiddlewares/authGuardMiddleware';
import { deviceIdMiddleware } from './userSessionsMiddlewares/isThereASessionValidation';

export const securityRouter = express.Router();

securityRouter.get('/devices',
    refreshTokenMiddleware,
    sessionTokenMiddleware,
    securityController.getAllSessionsByUserId
);

securityRouter.delete('/devices',
    refreshTokenMiddleware,
    sessionTokenMiddleware,
    securityController.deleteAllSessions
);

securityRouter.delete('/devices/:deviceId',
    refreshTokenMiddleware,
    sessionTokenMiddleware,
    deviceIdMiddleware,
    securityController.deleteSessionByDeviceId
);