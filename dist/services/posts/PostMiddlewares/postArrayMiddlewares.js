"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostMiddlewares = exports.updatePostMiddlewares = exports.postPostIdCommentsMiddlewares = exports.getPostIdAllCommentsMiddlewares = exports.postPostMiddlewares = exports.getPostIdMiddlewares = exports.getAllPostMiddlewares = void 0;
const compositionRootCustom_1 = require("../../../shared/container/compositionRootCustom");
// import { container } from "../../../shared/container/iocRoot";
const input_validation_middleware_1 = require("../../../shared/middlewares/input-validation-middleware");
const commentsMiddlewares_1 = require("../../comments/CommentMiddlewares/commentsMiddlewares");
const postMiddlewares_1 = require("./postMiddlewares");
// const postsMiddlewares: PostsMiddlewares = container.resolve(PostsMiddlewares)
// const authMiddlewares: AuthMiddlewares = container.resolve(AuthMiddlewares)
exports.getAllPostMiddlewares = [
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getPostIdMiddlewares = [
    compositionRootCustom_1.postsMiddlewares.postIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postPostMiddlewares = [
    compositionRootCustom_1.authMiddlewares.oldAuthGuardMiddleware,
    ...postMiddlewares_1.postMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getPostIdAllCommentsMiddlewares = [
    compositionRootCustom_1.postsMiddlewares.postPostIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postPostIdCommentsMiddlewares = [
    compositionRootCustom_1.authMiddlewares.accessTokenMiddleware,
    compositionRootCustom_1.postsMiddlewares.postPostIdMiddleware,
    ...commentsMiddlewares_1.commentsMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.updatePostMiddlewares = [
    compositionRootCustom_1.authMiddlewares.oldAuthGuardMiddleware,
    compositionRootCustom_1.postsMiddlewares.postIdMiddleware,
    ...postMiddlewares_1.postMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.deletePostMiddlewares = [
    compositionRootCustom_1.authMiddlewares.oldAuthGuardMiddleware,
    compositionRootCustom_1.postsMiddlewares.postIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
