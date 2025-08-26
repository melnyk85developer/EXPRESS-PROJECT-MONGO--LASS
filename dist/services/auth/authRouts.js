"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
;
const authArrayMiddlewares_1 = require("./AuthMiddlewares/authArrayMiddlewares");
const compositionRootCustom_1 = require("../../shared/container/compositionRootCustom");
// import { authControllers } from "../../shared/container/compositionRootCustom";
exports.authRouter = express_1.default.Router();
// const authControllers: AuthControllers = container.get(AuthControllers)
// const authControllers = container.resolve(AuthControllers)
// console.log(authControllers)
exports.authRouter.post(`/registration`, authArrayMiddlewares_1.registrationMiddlewares, compositionRootCustom_1.authControllers.registrationController.bind(compositionRootCustom_1.authControllers));
exports.authRouter.post(`/login`, authArrayMiddlewares_1.loginMiddlewares, compositionRootCustom_1.authControllers.loginControllers.bind(compositionRootCustom_1.authControllers));
exports.authRouter.post(`/logout`, authArrayMiddlewares_1.logoutMiddlewares, compositionRootCustom_1.authControllers.logoutControllers.bind(compositionRootCustom_1.authControllers));
exports.authRouter.post(`/refresh-token`, authArrayMiddlewares_1.refreshTokenMiddlewares, compositionRootCustom_1.authControllers.refreshControllers.bind(compositionRootCustom_1.authControllers));
exports.authRouter.get(`/confirm-email`, authArrayMiddlewares_1.confirmationEmailMiddlewares, compositionRootCustom_1.authControllers.confirmationEmailControllers.bind(compositionRootCustom_1.authControllers));
exports.authRouter.post(`/registration-confirmation`, authArrayMiddlewares_1.registrationConfirmMiddlewares, compositionRootCustom_1.authControllers.registrationConfirmationControllers.bind(compositionRootCustom_1.authControllers));
exports.authRouter.post(`/registration-email-resending`, authArrayMiddlewares_1.registrationEmailResendingMiddlewares, compositionRootCustom_1.authControllers.registrationEmailResendingControllers.bind(compositionRootCustom_1.authControllers));
exports.authRouter.get(`/me`, authArrayMiddlewares_1.meMiddlewares, compositionRootCustom_1.authControllers.meControllers.bind(compositionRootCustom_1.authControllers));
