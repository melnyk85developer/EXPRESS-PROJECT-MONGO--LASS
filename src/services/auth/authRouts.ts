import "reflect-metadata"
import express from 'express';;
import { TYPES } from '../../shared/container/types';
import { confirmationEmailMiddlewares, loginMiddlewares, logoutMiddlewares, meMiddlewares, refreshTokenMiddlewares, registrationConfirmMiddlewares, registrationEmailResendingMiddlewares, registrationMiddlewares } from './AuthMiddlewares/authArrayMiddlewares';
// import { container } from "../../shared/container/iocRoot";
import { AuthControllers } from "./authControllers";
import { authControllers } from "../../shared/container/compositionRootCustom";
// import { authControllers } from "../../shared/container/compositionRootCustom";

export const authRouter = express.Router()
// const authControllers: AuthControllers = container.get(AuthControllers)
// const authControllers = container.resolve(AuthControllers)

// console.log(authControllers)

authRouter.post(`/registration`, registrationMiddlewares, authControllers.registrationController.bind(authControllers))
authRouter.post(`/login`, loginMiddlewares, authControllers.loginControllers.bind(authControllers))
authRouter.post(`/logout`, logoutMiddlewares, authControllers.logoutControllers.bind(authControllers))
authRouter.post(`/refresh-token`, refreshTokenMiddlewares, authControllers.refreshControllers.bind(authControllers))
authRouter.get(`/confirm-email`, confirmationEmailMiddlewares, authControllers.confirmationEmailControllers.bind(authControllers))
authRouter.post(`/registration-confirmation`, registrationConfirmMiddlewares, authControllers.registrationConfirmationControllers.bind(authControllers))
authRouter.post(`/registration-email-resending`, registrationEmailResendingMiddlewares, authControllers.registrationEmailResendingControllers.bind(authControllers))
authRouter.get(`/me`, meMiddlewares, authControllers.meControllers.bind(authControllers))