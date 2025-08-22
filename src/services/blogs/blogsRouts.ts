import express, { Response } from 'express';
import { deleteBlogMiddlewares, getBlogIdAllPostsMiddlewares, getBlogIdMiddlewares, getBlogsMiddlewares, postBlogIdOnePostMiddlewares, postBlogMiddlewares, updateBlogMiddlewares } from './BlogsMiddlewares/blogArrayMiddlewares';
import { blogsController } from './blogsController';

export const blogsRouter = express.Router()

blogsRouter.get('/', getBlogsMiddlewares, blogsController.getBlogsController)
blogsRouter.get('/:blogId/posts', getBlogIdAllPostsMiddlewares, blogsController.getBlogIdAllPostsController)
blogsRouter.get('/:id', getBlogIdMiddlewares, blogsController.getBlogByIdController)
blogsRouter.post('/', postBlogMiddlewares, blogsController.createBlogController)
blogsRouter.post('/:blogId/posts', postBlogIdOnePostMiddlewares, blogsController.createPostOneBlogController)
blogsRouter.put('/:id', updateBlogMiddlewares, blogsController.updateBlogController)
blogsRouter.delete('/:id', deleteBlogMiddlewares, blogsController.deleteBlogController)