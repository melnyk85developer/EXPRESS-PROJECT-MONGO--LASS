import { inputValidationMiddleware } from "../../../input-validation-middleware";
import { userMiddlewares } from "../../users/UserMiddlewares/userMiddlewares";
import { accessTokenMiddleware, authLoginMiddleware, refreshTokenMiddleware } from "./authGuardMiddleware";
import { inputMiddlewares } from "./imputAuthMiddlewares";
import { confirmEmailMiddlewares, registrationConfirmationMiddlewares } from "./postMiddlewares";

export const registrationMiddlewares = [
    ...userMiddlewares, // Распаковываем массив, если это ValidationChain[]
    inputValidationMiddleware, // Одиночный middleware
]
export const loginMiddlewares = [
    ...inputMiddlewares, // Распаковываем массив
    authLoginMiddleware, // Одиночный middleware
    inputValidationMiddleware,
]
export const logoutMiddlewares = [
    refreshTokenMiddleware, // Одиночный middleware
    inputValidationMiddleware,
]
export const refreshTokenMiddlewares = [
    refreshTokenMiddleware, // Одиночный middleware
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
    accessTokenMiddleware,
    inputValidationMiddleware,
]