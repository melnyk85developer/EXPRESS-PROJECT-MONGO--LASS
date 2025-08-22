"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const commentsControllers_1 = require("./commentsControllers");
const commentArrayMiddlewares_1 = require("./CommentMiddlewares/commentArrayMiddlewares");
exports.commentsRouter = express_1.default.Router();
exports.commentsRouter.get('/:id', commentArrayMiddlewares_1.getCommentIdMiddlewares, commentsControllers_1.commentsController.getCommentByIdController);
exports.commentsRouter.put('/:commentId', commentArrayMiddlewares_1.updateCommentMiddlewares, commentsControllers_1.commentsController.updateCommentController);
exports.commentsRouter.delete('/:commentId', commentArrayMiddlewares_1.deleteCommentMiddlewares, commentsControllers_1.commentsController.deleteCommentController);
