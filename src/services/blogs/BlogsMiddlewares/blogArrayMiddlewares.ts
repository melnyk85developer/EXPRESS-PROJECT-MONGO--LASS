import { inputValidationMiddleware } from "../../../shared/middlewares/input-validation-middleware";
import { oldAuthGuardMiddleware } from "../../auth/AuthMiddlewares/authGuardMiddleware";
import { postOneBlogMiddlewares } from "../../posts/PostMiddlewares/postMiddlewares";
import { blogMiddlewares } from "./blogMiddlewares";
import { blogIdMiddleware, isBlogIdMiddleware } from "./isThereABlogValidation";

export const getBlogsMiddlewares = [
    inputValidationMiddleware,
]
export const getBlogIdAllPostsMiddlewares = [
    isBlogIdMiddleware,
    inputValidationMiddleware,
]
export const getBlogIdMiddlewares = [
    blogIdMiddleware, 
    inputValidationMiddleware, 
]
export const postBlogMiddlewares = [
    oldAuthGuardMiddleware,
    ...blogMiddlewares, 
    inputValidationMiddleware, 
]
export const postBlogIdOnePostMiddlewares = [
    oldAuthGuardMiddleware,
    isBlogIdMiddleware,
    ...postOneBlogMiddlewares,
    inputValidationMiddleware,
]
export const updateBlogMiddlewares = [
    oldAuthGuardMiddleware,
    blogIdMiddleware, 
    ...blogMiddlewares, 
    inputValidationMiddleware
]
export const deleteBlogMiddlewares = [
    oldAuthGuardMiddleware,
    blogIdMiddleware, 
    inputValidationMiddleware,
]