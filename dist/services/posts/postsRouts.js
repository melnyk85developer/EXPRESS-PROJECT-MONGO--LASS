"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const postArrayMiddlewares_1 = require("./PostMiddlewares/postArrayMiddlewares");
const compositionRootCustom_1 = require("../../shared/container/compositionRootCustom");
exports.postRouter = express_1.default.Router();
// const postsControllers: PostsControllers = container.resolve(PostsControllers)
exports.postRouter.get('/', postArrayMiddlewares_1.getAllPostMiddlewares, compositionRootCustom_1.postsControllers.getAllPostsController.bind(compositionRootCustom_1.postsControllers));
exports.postRouter.get('/:id', postArrayMiddlewares_1.getPostIdMiddlewares, compositionRootCustom_1.postsControllers.getPostByIdController.bind(compositionRootCustom_1.postsControllers));
exports.postRouter.post('/', postArrayMiddlewares_1.postPostMiddlewares, compositionRootCustom_1.postsControllers.createPostController.bind(compositionRootCustom_1.postsControllers));
exports.postRouter.get('/:postId/comments', postArrayMiddlewares_1.getPostIdAllCommentsMiddlewares, compositionRootCustom_1.postsControllers.getAllCommentsByPostIdController.bind(compositionRootCustom_1.postsControllers));
exports.postRouter.post('/:postId/comments', postArrayMiddlewares_1.postPostIdCommentsMiddlewares, compositionRootCustom_1.postsControllers.createCommentByPostIdController.bind(compositionRootCustom_1.postsControllers));
exports.postRouter.put('/:id', postArrayMiddlewares_1.updatePostMiddlewares, compositionRootCustom_1.postsControllers.updatePostController.bind(compositionRootCustom_1.postsControllers));
exports.postRouter.delete('/:id', postArrayMiddlewares_1.deletePostMiddlewares, compositionRootCustom_1.postsControllers.deletePostController.bind(compositionRootCustom_1.postsControllers));
