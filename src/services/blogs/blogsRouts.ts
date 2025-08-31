import { container } from "../../shared/container/iocRoot";
import express, { Response } from 'express';
import { deleteBlogMiddlewares, getBlogIdAllPostsMiddlewares, getBlogIdMiddlewares, getBlogsMiddlewares, postBlogIdOnePostMiddlewares, postBlogMiddlewares, updateBlogMiddlewares } from './BlogsMiddlewares/blogArrayMiddlewares';
import { BlogsControllers } from "./blogsController";

export const blogsRouter = express.Router()
const blogsControllers: BlogsControllers = container.get(BlogsControllers)

blogsRouter.get('/', getBlogsMiddlewares, blogsControllers.getBlogsController.bind(blogsControllers))
blogsRouter.get('/:blogId/posts', getBlogIdAllPostsMiddlewares, blogsControllers.getBlogIdAllPostsController.bind(blogsControllers))
blogsRouter.get('/:id', getBlogIdMiddlewares, blogsControllers.getBlogByIdController.bind(blogsControllers))
blogsRouter.post('/', postBlogMiddlewares, blogsControllers.createBlogController.bind(blogsControllers))
blogsRouter.post('/:blogId/posts', postBlogIdOnePostMiddlewares, blogsControllers.createPostOneBlogController.bind(blogsControllers))
blogsRouter.put('/:id', updateBlogMiddlewares, blogsControllers.updateBlogController.bind(blogsControllers))
blogsRouter.delete('/:id', deleteBlogMiddlewares, blogsControllers.deleteBlogController.bind(blogsControllers))