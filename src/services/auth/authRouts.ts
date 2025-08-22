import express, { Response } from 'express';
import { confirmationEmailMiddlewares, loginMiddlewares, logoutMiddlewares, meMiddlewares, refreshTokenMiddlewares, registrationConfirmMiddlewares, registrationEmailResendingMiddlewares, registrationMiddlewares } from './AuthMiddlewares/authArrayMiddlewares';
import { authController } from './authControllers';

export const authRouter = express.Router()
authRouter.post(`/registration`, registrationMiddlewares, authController.registration)
authRouter.post(`/login`, loginMiddlewares, authController.login)
authRouter.post(`/logout`, logoutMiddlewares, authController.logout)
authRouter.post(`/refresh-token`, refreshTokenMiddlewares, authController.refresh)
authRouter.get(`/confirm-email`, confirmationEmailMiddlewares, authController.confirmationEmail)
authRouter.post(`/registration-confirmation`, registrationConfirmMiddlewares, authController.registrationConfirmation)
authRouter.post(`/registration-email-resending`, registrationEmailResendingMiddlewares, authController.registrationEmailResending)
authRouter.get(`/me`, meMiddlewares, authController.me)