"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = __importDefault(require("express"));
const postControllers_1 = require("./postControllers");
const postArrayMiddlewares_1 = require("./PostMiddlewares/postArrayMiddlewares");
exports.postRouter = express_1.default.Router();
exports.postRouter.get('/', postArrayMiddlewares_1.getAllPostMiddlewares, postControllers_1.postsController.getAllPostsController);
exports.postRouter.get('/:id', postArrayMiddlewares_1.getPostIdMiddlewares, postControllers_1.postsController.getPostByIdController);
exports.postRouter.post('/', postArrayMiddlewares_1.postPostMiddlewares, postControllers_1.postsController.createPostController);
exports.postRouter.get('/:postId/comments', postArrayMiddlewares_1.getPostIdAllCommentsMiddlewares, postControllers_1.postsController.getAllCommentsByPostIdController);
exports.postRouter.post('/:postId/comments', postArrayMiddlewares_1.postPostIdCommentsMiddlewares, postControllers_1.postsController.createCommentByPostIdController);
exports.postRouter.put('/:id', postArrayMiddlewares_1.updatePostMiddlewares, postControllers_1.postsController.updatePostController);
exports.postRouter.delete('/:id', postArrayMiddlewares_1.deletePostMiddlewares, postControllers_1.postsController.deletePostController);
