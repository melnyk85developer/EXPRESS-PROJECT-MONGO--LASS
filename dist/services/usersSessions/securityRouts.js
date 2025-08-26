"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const compositionRootCustom_1 = require("../../shared/container/compositionRootCustom");
// import { authMiddlewares, securityControllers, sessionsMiddlewares } from '../../shared/container/compositionRootCustom';
exports.securityRouter = express_1.default.Router();
// const authMiddlewares: AuthMiddlewares = container.resolve(AuthMiddlewares)
// const securityControllers: SecurityController = container.resolve(SecurityController)
// const sessionsMiddlewares: SessionsMiddlewares = container.resolve(SessionsMiddlewares)
exports.securityRouter.get('/devices', compositionRootCustom_1.authMiddlewares.refreshTokenMiddleware, compositionRootCustom_1.authMiddlewares.sessionTokenMiddleware, compositionRootCustom_1.securityControllers.getAllSessionsByUserId.bind(compositionRootCustom_1.securityControllers));
exports.securityRouter.delete('/devices', compositionRootCustom_1.authMiddlewares.refreshTokenMiddleware, compositionRootCustom_1.authMiddlewares.sessionTokenMiddleware, compositionRootCustom_1.securityControllers.deleteAllSessions.bind(compositionRootCustom_1.securityControllers));
exports.securityRouter.delete('/devices/:deviceId', compositionRootCustom_1.authMiddlewares.refreshTokenMiddleware, compositionRootCustom_1.authMiddlewares.sessionTokenMiddleware, compositionRootCustom_1.sessionsMiddlewares.deviceIdMiddleware, compositionRootCustom_1.securityControllers.deleteSessionByDeviceId.bind(compositionRootCustom_1.securityControllers));
