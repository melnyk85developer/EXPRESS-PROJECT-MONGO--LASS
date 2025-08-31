import express from 'express';;
import { confirmationEmailMiddlewares, loginMiddlewares, logoutMiddlewares, meMiddlewares, refreshTokenMiddlewares, registrationConfirmMiddlewares, registrationEmailResendingMiddlewares, registrationMiddlewares } from './AuthMiddlewares/authArrayMiddlewares';
import { AuthControllers } from "./authControllers";
import { container } from "../../shared/container/iocRoot";

export const authRouter = express.Router()
const authControllers: AuthControllers = container.get(AuthControllers)

authRouter.post(`/registration`, registrationMiddlewares, authControllers.registrationController.bind(authControllers))
authRouter.post(`/login`, loginMiddlewares, authControllers.loginControllers.bind(authControllers))
authRouter.post(`/logout`, logoutMiddlewares, authControllers.logoutControllers.bind(authControllers))
authRouter.post(`/refresh-token`, refreshTokenMiddlewares, authControllers.refreshControllers.bind(authControllers))
authRouter.get(`/confirm-email`, confirmationEmailMiddlewares, authControllers.confirmationEmailControllers.bind(authControllers))
authRouter.post(`/registration-confirmation`, registrationConfirmMiddlewares, authControllers.registrationConfirmationControllers.bind(authControllers))
authRouter.post(`/registration-email-resending`, registrationEmailResendingMiddlewares, authControllers.registrationEmailResendingControllers.bind(authControllers))
authRouter.get(`/me`, meMiddlewares, authControllers.meControllers.bind(authControllers))