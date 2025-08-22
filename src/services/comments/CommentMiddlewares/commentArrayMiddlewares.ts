import { inputValidationMiddleware } from "../../../shared/middlewares/input-validation-middleware";
import { accessTokenMiddleware } from "../../auth/AuthMiddlewares/authGuardMiddleware";
import { commentsMiddleware } from "./commentsMiddlewares";
import { commentCommentIdMiddleware, commentIdMiddleware } from "./isThereACommentValidation";

export const getCommentIdMiddlewares = [
    commentIdMiddleware,
    inputValidationMiddleware,
]
export const updateCommentMiddlewares = [
    accessTokenMiddleware,
    commentCommentIdMiddleware,
    ...commentsMiddleware,
    inputValidationMiddleware,
]
export const deleteCommentMiddlewares = [
    accessTokenMiddleware,
    commentCommentIdMiddleware,
    inputValidationMiddleware, 
]