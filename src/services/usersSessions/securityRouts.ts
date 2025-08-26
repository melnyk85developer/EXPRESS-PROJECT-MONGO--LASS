import "reflect-metadata"
import express from 'express';
// import { container } from '../../shared/container/iocRoot';
import { SecurityController } from './securityController';
import { AuthMiddlewares } from '../auth/AuthMiddlewares/authGuardMiddleware';
import { SessionsMiddlewares } from './userSessionsMiddlewares/isThereASessionValidation';
import { authMiddlewares, securityControllers, sessionsMiddlewares } from "../../shared/container/compositionRootCustom";
// import { authMiddlewares, securityControllers, sessionsMiddlewares } from '../../shared/container/compositionRootCustom';

export const securityRouter = express.Router();

// const authMiddlewares: AuthMiddlewares = container.resolve(AuthMiddlewares)
// const securityControllers: SecurityController = container.resolve(SecurityController)
// const sessionsMiddlewares: SessionsMiddlewares = container.resolve(SessionsMiddlewares)

securityRouter.get('/devices',
    authMiddlewares.refreshTokenMiddleware,
    authMiddlewares.sessionTokenMiddleware,
    securityControllers.getAllSessionsByUserId.bind(securityControllers)
);

securityRouter.delete('/devices',
    authMiddlewares.refreshTokenMiddleware,
    authMiddlewares.sessionTokenMiddleware,
    securityControllers.deleteAllSessions.bind(securityControllers)
);

securityRouter.delete('/devices/:deviceId',
    authMiddlewares.refreshTokenMiddleware,
    authMiddlewares.sessionTokenMiddleware,
    sessionsMiddlewares.deviceIdMiddleware,
    securityControllers.deleteSessionByDeviceId.bind(securityControllers)
);