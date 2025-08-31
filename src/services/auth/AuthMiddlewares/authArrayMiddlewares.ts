import { container } from "../../../shared/container/iocRoot";
import { inputValidationMiddleware } from "../../../shared/input-validation-middleware";
import { userMiddlewares } from "../../users/UserMiddlewares/userMiddlewares";
import { AuthMiddlewares } from "./authGuardMiddleware";
import { inputMiddlewares } from "./imputAuthMiddlewares";
import { confirmEmailMiddlewares, registrationConfirmationMiddlewares } from "./postMiddlewares";

const authMiddlewares: AuthMiddlewares = container.get(AuthMiddlewares)

export const registrationMiddlewares = [
    ...userMiddlewares,
    inputValidationMiddleware,
]
export const loginMiddlewares = [
    ...inputMiddlewares,
    authMiddlewares.authLoginMiddleware,
    inputValidationMiddleware,
]
export const logoutMiddlewares = [
    authMiddlewares.refreshTokenMiddleware,
    inputValidationMiddleware,
]
export const refreshTokenMiddlewares = [
    authMiddlewares.refreshTokenMiddleware,
    inputValidationMiddleware,
]
export const confirmationEmailMiddlewares = [
    ...confirmEmailMiddlewares,
    inputValidationMiddleware,
]
export const registrationConfirmMiddlewares = [
    ...registrationConfirmationMiddlewares,
    inputValidationMiddleware,
]
export const registrationEmailResendingMiddlewares = [
    inputValidationMiddleware,
]
export const meMiddlewares = [
    authMiddlewares.accessTokenMiddleware,
    inputValidationMiddleware,
]