import { container } from "../../../shared/container/iocRoot";
import { inputValidationMiddleware } from "../../../shared/middlewares/input-validation-middleware";
import { AuthMiddlewares } from "../../auth/AuthMiddlewares/authGuardMiddleware";
import { UsersMiddlewares } from "./isThereAUserValidation";
import { userMiddlewares } from "./userMiddlewares";

const usersMiddlewares: UsersMiddlewares = container.get(UsersMiddlewares)
const authMiddlewares: AuthMiddlewares = container.get(AuthMiddlewares)

export const getAllUsersMiddlewares = [
    inputValidationMiddleware,
]
export const getUserByIdMiddlewares = [
    usersMiddlewares.userIdMiddleware,
    inputValidationMiddleware,
]
export const postUserMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    ...userMiddlewares, 
    inputValidationMiddleware,
]
export const updateUserMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    usersMiddlewares.userIdMiddleware, 
    ...userMiddlewares, 
    inputValidationMiddleware,
]
export const deleteUserMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    usersMiddlewares.userIdMiddleware, 
    inputValidationMiddleware, 
]