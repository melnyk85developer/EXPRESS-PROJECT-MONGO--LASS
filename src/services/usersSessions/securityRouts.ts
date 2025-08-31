import express from 'express';
import { container } from '../../shared/container/iocRoot';
import { SecurityController } from './securityController';
import { AuthMiddlewares } from '../auth/AuthMiddlewares/authGuardMiddleware';
import { SessionsMiddlewares } from './userSessionsMiddlewares/isThereASessionValidation';

export const securityRouter = express.Router();

const authMiddlewares: AuthMiddlewares = container.get(AuthMiddlewares)
const securityControllers: SecurityController = container.get(SecurityController)
const sessionsMiddlewares: SessionsMiddlewares = container.get(SessionsMiddlewares)

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