"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostMiddlewares = exports.updatePostMiddlewares = exports.postPostIdCommentsMiddlewares = exports.getPostIdAllCommentsMiddlewares = exports.postPostMiddlewares = exports.getPostIdMiddlewares = exports.getAllPostMiddlewares = void 0;
const input_validation_middleware_1 = require("../../../shared/middlewares/input-validation-middleware");
const authGuardMiddleware_1 = require("../../auth/AuthMiddlewares/authGuardMiddleware");
const commentsMiddlewares_1 = require("../../comments/CommentMiddlewares/commentsMiddlewares");
const isThereAPostValidation_1 = require("./isThereAPostValidation");
const postMiddlewares_1 = require("./postMiddlewares");
exports.getAllPostMiddlewares = [
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getPostIdMiddlewares = [
    isThereAPostValidation_1.postIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postPostMiddlewares = [
    authGuardMiddleware_1.oldAuthGuardMiddleware,
    ...postMiddlewares_1.postMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getPostIdAllCommentsMiddlewares = [
    isThereAPostValidation_1.postPostIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postPostIdCommentsMiddlewares = [
    authGuardMiddleware_1.accessTokenMiddleware,
    isThereAPostValidation_1.postPostIdMiddleware,
    ...commentsMiddlewares_1.commentsMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.updatePostMiddlewares = [
    authGuardMiddleware_1.oldAuthGuardMiddleware,
    isThereAPostValidation_1.postIdMiddleware,
    ...postMiddlewares_1.postMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.deletePostMiddlewares = [
    authGuardMiddleware_1.oldAuthGuardMiddleware,
    isThereAPostValidation_1.postIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
