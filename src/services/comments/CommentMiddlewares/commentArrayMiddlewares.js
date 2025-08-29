"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommentMiddlewares = exports.updateCommentMiddlewares = exports.getCommentIdMiddlewares = void 0;
const compositionRootCustom_1 = require("../../../shared/container/compositionRootCustom");
// import { container } from "../../../shared/container/iocRoot";
const input_validation_middleware_1 = require("../../../shared/middlewares/input-validation-middleware");
const commentsMiddlewares_1 = require("./commentsMiddlewares");
// const commentsMiddlewares = container.resolve(СommentsMiddlewares)
// const authMiddlewares = container.resolve(AuthMiddlewares)
exports.getCommentIdMiddlewares = [
    compositionRootCustom_1.commentsMiddlewares.commentIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.updateCommentMiddlewares = [
    compositionRootCustom_1.authMiddlewares.accessTokenMiddleware,
    compositionRootCustom_1.commentsMiddlewares.commentCommentIdMiddleware,
    ...commentsMiddlewares_1.commentsMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.deleteCommentMiddlewares = [
    compositionRootCustom_1.authMiddlewares.accessTokenMiddleware,
    compositionRootCustom_1.commentsMiddlewares.commentCommentIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
