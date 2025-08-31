"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentMiddlewares = exports.updateCommentMiddlewares = exports.getCommentIdMiddlewares = void 0;
const iocRoot_1 = require("../../../shared/container/iocRoot");
const input_validation_middleware_1 = require("../../../shared/middlewares/input-validation-middleware");
const authGuardMiddleware_1 = require("../../auth/AuthMiddlewares/authGuardMiddleware");
const commentsMiddlewares_1 = require("./commentsMiddlewares");
const isThereACommentValidation_1 = require("./isThereACommentValidation");
const commentsMiddlewares = iocRoot_1.container.get(isThereACommentValidation_1.СommentsMiddlewares);
const authMiddlewares = iocRoot_1.container.get(authGuardMiddleware_1.AuthMiddlewares);
exports.getCommentIdMiddlewares = [
    commentsMiddlewares.commentIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.updateCommentMiddlewares = [
    authMiddlewares.accessTokenMiddleware,
    commentsMiddlewares.commentCommentIdMiddleware,
    ...commentsMiddlewares_1.commentsMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.deleteCommentMiddlewares = [
    authMiddlewares.accessTokenMiddleware,
    commentsMiddlewares.commentCommentIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
