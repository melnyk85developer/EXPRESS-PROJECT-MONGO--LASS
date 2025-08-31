"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const iocRoot_1 = require("../../shared/container/iocRoot");
const express_1 = __importDefault(require("express"));
const blogArrayMiddlewares_1 = require("./BlogsMiddlewares/blogArrayMiddlewares");
const blogsController_1 = require("./blogsController");
exports.blogsRouter = express_1.default.Router();
const blogsControllers = iocRoot_1.container.get(blogsController_1.BlogsControllers);
exports.blogsRouter.get('/', blogArrayMiddlewares_1.getBlogsMiddlewares, blogsControllers.getBlogsController.bind(blogsControllers));
exports.blogsRouter.get('/:blogId/posts', blogArrayMiddlewares_1.getBlogIdAllPostsMiddlewares, blogsControllers.getBlogIdAllPostsController.bind(blogsControllers));
exports.blogsRouter.get('/:id', blogArrayMiddlewares_1.getBlogIdMiddlewares, blogsControllers.getBlogByIdController.bind(blogsControllers));
exports.blogsRouter.post('/', blogArrayMiddlewares_1.postBlogMiddlewares, blogsControllers.createBlogController.bind(blogsControllers));
exports.blogsRouter.post('/:blogId/posts', blogArrayMiddlewares_1.postBlogIdOnePostMiddlewares, blogsControllers.createPostOneBlogController.bind(blogsControllers));
exports.blogsRouter.put('/:id', blogArrayMiddlewares_1.updateBlogMiddlewares, blogsControllers.updateBlogController.bind(blogsControllers));
exports.blogsRouter.delete('/:id', blogArrayMiddlewares_1.deleteBlogMiddlewares, blogsControllers.deleteBlogController.bind(blogsControllers));
