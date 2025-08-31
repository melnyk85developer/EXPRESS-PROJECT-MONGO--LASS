"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const commentArrayMiddlewares_1 = require("./CommentMiddlewares/commentArrayMiddlewares");
const iocRoot_1 = require("../../shared/container/iocRoot");
const commentsControllers_1 = require("./commentsControllers");
exports.commentsRouter = express_1.default.Router();
const commentsControllers = iocRoot_1.container.get(commentsControllers_1.CommentsControllers);
exports.commentsRouter.get('/:id', commentArrayMiddlewares_1.getCommentIdMiddlewares, commentsControllers.getCommentByIdController.bind(commentsControllers));
exports.commentsRouter.put('/:commentId', commentArrayMiddlewares_1.updateCommentMiddlewares, commentsControllers.updateCommentController.bind(commentsControllers));
exports.commentsRouter.delete('/:commentId', commentArrayMiddlewares_1.deleteCommentMiddlewares, commentsControllers.deleteCommentController.bind(commentsControllers));
