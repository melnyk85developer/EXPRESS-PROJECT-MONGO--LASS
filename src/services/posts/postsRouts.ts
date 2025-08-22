import express, { Response } from 'express';
import { postsController } from './postControllers';
import { deletePostMiddlewares, getAllPostMiddlewares, getPostIdAllCommentsMiddlewares, getPostIdMiddlewares, postPostIdCommentsMiddlewares, postPostMiddlewares, updatePostMiddlewares } from './PostMiddlewares/postArrayMiddlewares';

export const postRouter = express.Router()

postRouter.get('/', getAllPostMiddlewares, postsController.getAllPostsController)
postRouter.get('/:id', getPostIdMiddlewares, postsController.getPostByIdController)
postRouter.post('/', postPostMiddlewares, postsController.createPostController)
postRouter.get('/:postId/comments', getPostIdAllCommentsMiddlewares, postsController.getAllCommentsByPostIdController)
postRouter.post('/:postId/comments', postPostIdCommentsMiddlewares, postsController.createCommentByPostIdController)
postRouter.put('/:id', updatePostMiddlewares, postsController.updatePostController)
postRouter.delete('/:id', deletePostMiddlewares, postsController.deletePostController)