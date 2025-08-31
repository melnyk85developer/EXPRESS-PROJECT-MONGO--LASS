"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostMiddlewares = exports.updatePostMiddlewares = exports.postPostIdCommentsMiddlewares = exports.getPostIdAllCommentsMiddlewares = exports.postPostMiddlewares = exports.getPostIdMiddlewares = exports.getAllPostMiddlewares = void 0;
const iocRoot_1 = require("../../../shared/container/iocRoot");
const input_validation_middleware_1 = require("../../../shared/middlewares/input-validation-middleware");
const authGuardMiddleware_1 = require("../../auth/AuthMiddlewares/authGuardMiddleware");
const commentsMiddlewares_1 = require("../../comments/CommentMiddlewares/commentsMiddlewares");
const isThereAPostValidation_1 = require("./isThereAPostValidation");
const postMiddlewares_1 = require("./postMiddlewares");
const postsMiddlewares = iocRoot_1.container.get(isThereAPostValidation_1.PostsMiddlewares);
const authMiddlewares = iocRoot_1.container.get(authGuardMiddleware_1.AuthMiddlewares);
exports.getAllPostMiddlewares = [
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getPostIdMiddlewares = [
    postsMiddlewares.postIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postPostMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    ...postMiddlewares_1.postMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getPostIdAllCommentsMiddlewares = [
    postsMiddlewares.postPostIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postPostIdCommentsMiddlewares = [
    authMiddlewares.accessTokenMiddleware,
    postsMiddlewares.postPostIdMiddleware,
    ...commentsMiddlewares_1.commentsMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.updatePostMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    postsMiddlewares.postIdMiddleware,
    ...postMiddlewares_1.postMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.deletePostMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    postsMiddlewares.postIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
