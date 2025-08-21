import { inputValidationMiddleware } from "../../../middlewares/input-validation-middleware";
import { accessTokenMiddleware, oldAuthGuardMiddleware } from "../../auth/AuthMiddlewares/authGuardMiddleware";
import { commentsMiddleware } from "../../comments/CommentMiddlewares/commentsMiddlewares";
import { postIdMiddleware, postPostIdMiddleware } from "./isThereAPostValidation";
import { postMiddlewares } from "./postMiddlewares";

export const getAllPostMiddlewares = [
    inputValidationMiddleware,
]
export const getPostIdMiddlewares = [
    postIdMiddleware, 
    inputValidationMiddleware,
]
export const postPostMiddlewares = [
    oldAuthGuardMiddleware,
    ...postMiddlewares, 
    inputValidationMiddleware, 
]
export const getPostIdAllCommentsMiddlewares = [
    postPostIdMiddleware,
    inputValidationMiddleware,
]
export const postPostIdCommentsMiddlewares = [
    accessTokenMiddleware,
    postPostIdMiddleware,
    ...commentsMiddleware,
    inputValidationMiddleware,
]
export const updatePostMiddlewares = [
    oldAuthGuardMiddleware,
    postIdMiddleware, 
    ...postMiddlewares, 
    inputValidationMiddleware, 
]
export const deletePostMiddlewares = [
    oldAuthGuardMiddleware,
    postIdMiddleware, 
    inputValidationMiddleware,  
]