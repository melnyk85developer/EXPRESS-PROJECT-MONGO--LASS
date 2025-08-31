import { container } from "../../../shared/container/iocRoot";
import { inputValidationMiddleware } from "../../../shared/middlewares/input-validation-middleware";
import { AuthMiddlewares } from "../../auth/AuthMiddlewares/authGuardMiddleware";
import { commentsMiddleware } from "./commentsMiddlewares";
import { СommentsMiddlewares } from "./isThereACommentValidation";

const commentsMiddlewares = container.get(СommentsMiddlewares)
const authMiddlewares = container.get(AuthMiddlewares)

export const getCommentIdMiddlewares = [
    commentsMiddlewares.commentIdMiddleware,
    inputValidationMiddleware,
]
export const updateCommentMiddlewares = [
    authMiddlewares.accessTokenMiddleware,
    commentsMiddlewares.commentCommentIdMiddleware,
    ...commentsMiddleware,
    inputValidationMiddleware,
]
export const deleteCommentMiddlewares = [
    authMiddlewares.accessTokenMiddleware,
    commentsMiddlewares.commentCommentIdMiddleware,
    inputValidationMiddleware, 
]