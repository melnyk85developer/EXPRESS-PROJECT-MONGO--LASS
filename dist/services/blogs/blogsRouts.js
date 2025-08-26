"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
require("reflect-metadata");
// import { container } from "../../shared/container/iocRoot";
const express_1 = __importDefault(require("express"));
const blogArrayMiddlewares_1 = require("./BlogsMiddlewares/blogArrayMiddlewares");
const compositionRootCustom_1 = require("../../shared/container/compositionRootCustom");
exports.blogsRouter = express_1.default.Router();
// const blogsControllers: BlogsControllers = container.resolve(BlogsControllers)
exports.blogsRouter.get('/', blogArrayMiddlewares_1.getBlogsMiddlewares, compositionRootCustom_1.blogsControllers.getBlogsController.bind(compositionRootCustom_1.blogsControllers));
exports.blogsRouter.get('/:blogId/posts', blogArrayMiddlewares_1.getBlogIdAllPostsMiddlewares, compositionRootCustom_1.blogsControllers.getBlogIdAllPostsController.bind(compositionRootCustom_1.blogsControllers));
exports.blogsRouter.get('/:id', blogArrayMiddlewares_1.getBlogIdMiddlewares, compositionRootCustom_1.blogsControllers.getBlogByIdController.bind(compositionRootCustom_1.blogsControllers));
exports.blogsRouter.post('/', blogArrayMiddlewares_1.postBlogMiddlewares, compositionRootCustom_1.blogsControllers.createBlogController.bind(compositionRootCustom_1.blogsControllers));
exports.blogsRouter.post('/:blogId/posts', blogArrayMiddlewares_1.postBlogIdOnePostMiddlewares, compositionRootCustom_1.blogsControllers.createPostOneBlogController.bind(compositionRootCustom_1.blogsControllers));
exports.blogsRouter.put('/:id', blogArrayMiddlewares_1.updateBlogMiddlewares, compositionRootCustom_1.blogsControllers.updateBlogController.bind(compositionRootCustom_1.blogsControllers));
exports.blogsRouter.delete('/:id', blogArrayMiddlewares_1.deleteBlogMiddlewares, compositionRootCustom_1.blogsControllers.deleteBlogController.bind(compositionRootCustom_1.blogsControllers));
