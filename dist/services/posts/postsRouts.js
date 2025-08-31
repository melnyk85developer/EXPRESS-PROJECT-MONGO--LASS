"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = __importDefault(require("express"));
const postArrayMiddlewares_1 = require("./PostMiddlewares/postArrayMiddlewares");
const iocRoot_1 = require("../../shared/container/iocRoot");
const postControllers_1 = require("./postControllers");
exports.postRouter = express_1.default.Router();
const postsControllers = iocRoot_1.container.get(postControllers_1.PostsControllers);
exports.postRouter.get('/', postArrayMiddlewares_1.getAllPostMiddlewares, postsControllers.getAllPostsController.bind(postsControllers));
exports.postRouter.get('/:id', postArrayMiddlewares_1.getPostIdMiddlewares, postsControllers.getPostByIdController.bind(postsControllers));
exports.postRouter.post('/', postArrayMiddlewares_1.postPostMiddlewares, postsControllers.createPostController.bind(postsControllers));
exports.postRouter.get('/:postId/comments', postArrayMiddlewares_1.getPostIdAllCommentsMiddlewares, postsControllers.getAllCommentsByPostIdController.bind(postsControllers));
exports.postRouter.post('/:postId/comments', postArrayMiddlewares_1.postPostIdCommentsMiddlewares, postsControllers.createCommentByPostIdController.bind(postsControllers));
exports.postRouter.put('/:id', postArrayMiddlewares_1.updatePostMiddlewares, postsControllers.updatePostController.bind(postsControllers));
exports.postRouter.delete('/:id', postArrayMiddlewares_1.deletePostMiddlewares, postsControllers.deletePostController.bind(postsControllers));
