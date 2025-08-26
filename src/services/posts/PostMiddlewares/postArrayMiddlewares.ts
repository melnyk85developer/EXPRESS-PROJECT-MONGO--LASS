import { authMiddlewares, postsMiddlewares } from "../../../shared/container/compositionRootCustom";
// import { container } from "../../../shared/container/iocRoot";
import { inputValidationMiddleware } from "../../../shared/middlewares/input-validation-middleware";
import { AuthMiddlewares } from "../../auth/AuthMiddlewares/authGuardMiddleware";
import { commentsMiddleware } from "../../comments/CommentMiddlewares/commentsMiddlewares";
import { PostsMiddlewares } from "./isThereAPostValidation";
import { postMiddlewares } from "./postMiddlewares";

// const postsMiddlewares: PostsMiddlewares = container.resolve(PostsMiddlewares)
// const authMiddlewares: AuthMiddlewares = container.resolve(AuthMiddlewares)

export const getAllPostMiddlewares = [
    inputValidationMiddleware,
]
export const getPostIdMiddlewares = [
    postsMiddlewares.postIdMiddleware, 
    inputValidationMiddleware,
]
export const postPostMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    ...postMiddlewares, 
    inputValidationMiddleware, 
]
export const getPostIdAllCommentsMiddlewares = [
    postsMiddlewares.postPostIdMiddleware,
    inputValidationMiddleware,
]
export const postPostIdCommentsMiddlewares = [
    authMiddlewares.accessTokenMiddleware,
    postsMiddlewares.postPostIdMiddleware,
    ...commentsMiddleware,
    inputValidationMiddleware,
]
export const updatePostMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    postsMiddlewares.postIdMiddleware, 
    ...postMiddlewares, 
    inputValidationMiddleware, 
]
export const deletePostMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    postsMiddlewares.postIdMiddleware, 
    inputValidationMiddleware,  
]