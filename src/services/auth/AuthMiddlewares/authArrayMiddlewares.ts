// import { authMiddlewares } from "../../../shared/container/compositionRootCustom";
// import { container } from "../../../shared/container/iocRoot";
import { authMiddlewares } from "../../../shared/container/compositionRootCustom";
import { inputValidationMiddleware } from "../../../shared/input-validation-middleware";
import { userMiddlewares } from "../../users/UserMiddlewares/userMiddlewares";
import { AuthMiddlewares } from "./authGuardMiddleware";
import { inputMiddlewares } from "./imputAuthMiddlewares";
import { confirmEmailMiddlewares, registrationConfirmationMiddlewares } from "./postMiddlewares";

// const authMiddlewares: AuthMiddlewares = container.resolve(AuthMiddlewares)

export const registrationMiddlewares = [
    ...userMiddlewares, // Распаковываем массив, если это ValidationChain[]
    inputValidationMiddleware, // Одиночный middleware
]
export const loginMiddlewares = [
    ...inputMiddlewares, // Распаковываем массив
    authMiddlewares.authLoginMiddleware, // Одиночный middleware
    inputValidationMiddleware,
]
export const logoutMiddlewares = [
    authMiddlewares.refreshTokenMiddleware, // Одиночный middleware
    inputValidationMiddleware,
]
export const refreshTokenMiddlewares = [
    authMiddlewares.refreshTokenMiddleware, // Одиночный middleware
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