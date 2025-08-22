"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const authArrayMiddlewares_1 = require("./AuthMiddlewares/authArrayMiddlewares");
const authControllers_1 = require("./authControllers");
exports.authRouter = express_1.default.Router();
exports.authRouter.post(`/registration`, authArrayMiddlewares_1.registrationMiddlewares, authControllers_1.authController.registration);
exports.authRouter.post(`/login`, authArrayMiddlewares_1.loginMiddlewares, authControllers_1.authController.login);
exports.authRouter.post(`/logout`, authArrayMiddlewares_1.logoutMiddlewares, authControllers_1.authController.logout);
exports.authRouter.post(`/refresh-token`, authArrayMiddlewares_1.refreshTokenMiddlewares, authControllers_1.authController.refresh);
exports.authRouter.get(`/confirm-email`, authArrayMiddlewares_1.confirmationEmailMiddlewares, authControllers_1.authController.confirmationEmail);
exports.authRouter.post(`/registration-confirmation`, authArrayMiddlewares_1.registrationConfirmMiddlewares, authControllers_1.authController.registrationConfirmation);
exports.authRouter.post(`/registration-email-resending`, authArrayMiddlewares_1.registrationEmailResendingMiddlewares, authControllers_1.authController.registrationEmailResending);
exports.authRouter.get(`/me`, authArrayMiddlewares_1.meMiddlewares, authControllers_1.authController.me);
