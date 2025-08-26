"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const commentArrayMiddlewares_1 = require("./CommentMiddlewares/commentArrayMiddlewares");
const compositionRootCustom_1 = require("../../shared/container/compositionRootCustom");
// import { commentsControllers } from "../../shared/container/compositionRootCustom";
exports.commentsRouter = express_1.default.Router();
// const commentsControllers: CommentsControllers = container.resolve(CommentsControllers)
exports.commentsRouter.get('/:id', commentArrayMiddlewares_1.getCommentIdMiddlewares, compositionRootCustom_1.commentsControllers.getCommentByIdController.bind(compositionRootCustom_1.commentsControllers));
exports.commentsRouter.put('/:commentId', commentArrayMiddlewares_1.updateCommentMiddlewares, compositionRootCustom_1.commentsControllers.updateCommentController.bind(compositionRootCustom_1.commentsControllers));
exports.commentsRouter.delete('/:commentId', commentArrayMiddlewares_1.deleteCommentMiddlewares, compositionRootCustom_1.commentsControllers.deleteCommentController.bind(compositionRootCustom_1.commentsControllers));
