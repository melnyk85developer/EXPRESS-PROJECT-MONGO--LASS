"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = __importDefault(require("express"));
const blogArrayMiddlewares_1 = require("./BlogsMiddlewares/blogArrayMiddlewares");
const blogsController_1 = require("./blogsController");
exports.blogsRouter = express_1.default.Router();
exports.blogsRouter.get('/', blogArrayMiddlewares_1.getBlogsMiddlewares, blogsController_1.blogsController.getBlogsController);
exports.blogsRouter.get('/:blogId/posts', blogArrayMiddlewares_1.getBlogIdAllPostsMiddlewares, blogsController_1.blogsController.getBlogIdAllPostsController);
exports.blogsRouter.get('/:id', blogArrayMiddlewares_1.getBlogIdMiddlewares, blogsController_1.blogsController.getBlogByIdController);
exports.blogsRouter.post('/', blogArrayMiddlewares_1.postBlogMiddlewares, blogsController_1.blogsController.createBlogController);
exports.blogsRouter.post('/:blogId/posts', blogArrayMiddlewares_1.postBlogIdOnePostMiddlewares, blogsController_1.blogsController.createPostOneBlogController);
exports.blogsRouter.put('/:id', blogArrayMiddlewares_1.updateBlogMiddlewares, blogsController_1.blogsController.updateBlogController);
exports.blogsRouter.delete('/:id', blogArrayMiddlewares_1.deleteBlogMiddlewares, blogsController_1.blogsController.deleteBlogController);
