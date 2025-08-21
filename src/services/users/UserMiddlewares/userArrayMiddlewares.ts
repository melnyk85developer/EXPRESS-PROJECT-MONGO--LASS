import { inputValidationMiddleware } from "../../../middlewares/input-validation-middleware";
import { oldAuthGuardMiddleware } from "../../auth/AuthMiddlewares/authGuardMiddleware";
import { userIdMiddleware } from "./isThereAUserValidation";
import { userMiddlewares } from "./userMiddlewares";

export const getAllUsersMiddlewares = [
    inputValidationMiddleware,
]
export const getUserByIdMiddlewares = [
    userIdMiddleware,
    inputValidationMiddleware,
]
export const postUserMiddlewares = [
    oldAuthGuardMiddleware,
    ...userMiddlewares, 
    inputValidationMiddleware,
]
export const updateUserMiddlewares = [
    oldAuthGuardMiddleware,
    userIdMiddleware, 
    ...userMiddlewares, 
    inputValidationMiddleware,
]
export const deleteUserMiddlewares = [
    oldAuthGuardMiddleware,
    userIdMiddleware, 
    inputValidationMiddleware, 
]