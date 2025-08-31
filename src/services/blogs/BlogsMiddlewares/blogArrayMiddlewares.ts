import { container } from "../../../shared/container/iocRoot";
import { inputValidationMiddleware } from "../../../shared/middlewares/input-validation-middleware";
import { AuthMiddlewares } from "../../auth/AuthMiddlewares/authGuardMiddleware";
import { postOneBlogMiddlewares } from "../../posts/PostMiddlewares/postMiddlewares";
import { blogMiddlewares } from "./blogMiddlewares";
import { BlogValidationMiddlewares } from "./isThereABlogValidation";

const authMiddlewares: AuthMiddlewares = container.get(AuthMiddlewares)
const blogValidationMiddlewares: BlogValidationMiddlewares = container.get(BlogValidationMiddlewares)

export const getBlogsMiddlewares = [
    inputValidationMiddleware,
]
export const getBlogIdAllPostsMiddlewares = [
    blogValidationMiddlewares.isBlogIdMiddleware,
    inputValidationMiddleware,
]
export const getBlogIdMiddlewares = [
    blogValidationMiddlewares.blogIdMiddleware, 
    inputValidationMiddleware, 
]
export const postBlogMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    ...blogMiddlewares, 
    inputValidationMiddleware, 
]
export const postBlogIdOnePostMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    blogValidationMiddlewares.isBlogIdMiddleware,
    ...postOneBlogMiddlewares,
    inputValidationMiddleware,
]
export const updateBlogMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    blogValidationMiddlewares.blogIdMiddleware, 
    ...blogMiddlewares, 
    inputValidationMiddleware
]
export const deleteBlogMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    blogValidationMiddlewares.blogIdMiddleware, 
    inputValidationMiddleware,
]