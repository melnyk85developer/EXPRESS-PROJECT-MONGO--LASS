"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.securityRouter = void 0;
const express_1 = __importDefault(require("express"));
const securityController_1 = require("./securityController");
const authGuardMiddleware_1 = require("../auth/AuthMiddlewares/authGuardMiddleware");
const isThereASessionValidation_1 = require("./userSessionsMiddlewares/isThereASessionValidation");
exports.securityRouter = express_1.default.Router();
exports.securityRouter.get('/devices', authGuardMiddleware_1.refreshTokenMiddleware, authGuardMiddleware_1.sessionTokenMiddleware, securityController_1.securityController.getAllSessionsByUserId);
exports.securityRouter.delete('/devices', authGuardMiddleware_1.refreshTokenMiddleware, authGuardMiddleware_1.sessionTokenMiddleware, securityController_1.securityController.deleteAllSessions);
exports.securityRouter.delete('/devices/:deviceId', authGuardMiddleware_1.refreshTokenMiddleware, authGuardMiddleware_1.sessionTokenMiddleware, isThereASessionValidation_1.deviceIdMiddleware, securityController_1.securityController.deleteSessionByDeviceId);
