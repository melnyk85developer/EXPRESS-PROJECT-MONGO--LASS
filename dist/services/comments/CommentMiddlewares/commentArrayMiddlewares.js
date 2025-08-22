"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentMiddlewares = exports.updateCommentMiddlewares = exports.getCommentIdMiddlewares = void 0;
const input_validation_middleware_1 = require("../../../shared/middlewares/input-validation-middleware");
const authGuardMiddleware_1 = require("../../auth/AuthMiddlewares/authGuardMiddleware");
const commentsMiddlewares_1 = require("./commentsMiddlewares");
const isThereACommentValidation_1 = require("./isThereACommentValidation");
exports.getCommentIdMiddlewares = [
    isThereACommentValidation_1.commentIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.updateCommentMiddlewares = [
    authGuardMiddleware_1.accessTokenMiddleware,
    isThereACommentValidation_1.commentCommentIdMiddleware,
    ...commentsMiddlewares_1.commentsMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.deleteCommentMiddlewares = [
    authGuardMiddleware_1.accessTokenMiddleware,
    isThereACommentValidation_1.commentCommentIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
