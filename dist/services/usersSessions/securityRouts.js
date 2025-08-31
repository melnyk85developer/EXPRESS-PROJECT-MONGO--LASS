"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
const express_1 = __importDefault(require("express"));
const iocRoot_1 = require("../../shared/container/iocRoot");
const securityController_1 = require("./securityController");
const authGuardMiddleware_1 = require("../auth/AuthMiddlewares/authGuardMiddleware");
const isThereASessionValidation_1 = require("./userSessionsMiddlewares/isThereASessionValidation");
exports.securityRouter = express_1.default.Router();
const authMiddlewares = iocRoot_1.container.get(authGuardMiddleware_1.AuthMiddlewares);
const securityControllers = iocRoot_1.container.get(securityController_1.SecurityController);
const sessionsMiddlewares = iocRoot_1.container.get(isThereASessionValidation_1.SessionsMiddlewares);
exports.securityRouter.get('/devices', authMiddlewares.refreshTokenMiddleware, authMiddlewares.sessionTokenMiddleware, securityControllers.getAllSessionsByUserId.bind(securityControllers));
exports.securityRouter.delete('/devices', authMiddlewares.refreshTokenMiddleware, authMiddlewares.sessionTokenMiddleware, securityControllers.deleteAllSessions.bind(securityControllers));
exports.securityRouter.delete('/devices/:deviceId', authMiddlewares.refreshTokenMiddleware, authMiddlewares.sessionTokenMiddleware, sessionsMiddlewares.deviceIdMiddleware, securityControllers.deleteSessionByDeviceId.bind(securityControllers));
