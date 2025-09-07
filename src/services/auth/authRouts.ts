import express from 'express';;
import { confirmationEmailMiddlewares, loginMiddlewares, logoutMiddlewares, meMiddlewares, refreshTokenMiddlewares, registrationConfirmMiddlewares, registrationEmailResendingMiddlewares, registrationMiddlewares } from './AuthMiddlewares/authArrayMiddlewares';
import { AuthControllers } from "./authControllers";
import { container } from "../../shared/container/iocRoot";

export const authRouter = express.Router()
const authControllers: AuthControllers = container.get(AuthControllers)

authRouter.post(`/registration`, 
    registrationMiddlewares, 
    authControllers.registrationController.bind(authControllers)
)
authRouter.post(`/login`, 
    loginMiddlewares, 
    authControllers.loginController.bind(authControllers)
)
authRouter.post(`/logout`,
    logoutMiddlewares, 
    authControllers.logoutController.bind(authControllers)
)
authRouter.post(`/refresh-token`, 
    refreshTokenMiddlewares, 
    authControllers.refreshController.bind(authControllers)
)
authRouter.get(`/confirm-email`, 
    confirmationEmailMiddlewares, 
    authControllers.confirmationEmailController.bind(authControllers)
)
authRouter.post(`/registration-confirmation`, 
    registrationConfirmMiddlewares, 
    authControllers.registrationConfirmationController.bind(authControllers)
)
authRouter.post(`/registration-email-resending`, 
    registrationEmailResendingMiddlewares, 
    authControllers.registrationEmailResendingController.bind(authControllers)
)
authRouter.post(`/password-recovery`,
    registrationEmailResendingMiddlewares, 
    authControllers.passwordRecoveryController.bind(authControllers)
)
authRouter.post(`/new-password`,
    registrationEmailResendingMiddlewares, 
    authControllers.newPasswordController.bind(authControllers)
)
authRouter.get(`/me`, 
    meMiddlewares, 
    authControllers.meController.bind(authControllers)
)