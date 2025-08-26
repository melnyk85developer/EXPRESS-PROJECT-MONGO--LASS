import "reflect-metadata"
import express, { Response } from 'express';
import { deletePostMiddlewares, getAllPostMiddlewares, getPostIdAllCommentsMiddlewares, getPostIdMiddlewares, postPostIdCommentsMiddlewares, postPostMiddlewares, updatePostMiddlewares } from './PostMiddlewares/postArrayMiddlewares';
// import { container } from '../../shared/container/iocRoot';
import { PostsControllers } from './postControllers';
import { postsControllers } from '../../shared/container/compositionRootCustom';

export const postRouter = express.Router()

// const postsControllers: PostsControllers = container.resolve(PostsControllers)

postRouter.get('/', getAllPostMiddlewares, postsControllers.getAllPostsController.bind(postsControllers))
postRouter.get('/:id', getPostIdMiddlewares, postsControllers.getPostByIdController.bind(postsControllers))
postRouter.post('/', postPostMiddlewares, postsControllers.createPostController.bind(postsControllers))
postRouter.get('/:postId/comments', getPostIdAllCommentsMiddlewares, postsControllers.getAllCommentsByPostIdController.bind(postsControllers))
postRouter.post('/:postId/comments', postPostIdCommentsMiddlewares, postsControllers.createCommentByPostIdController.bind(postsControllers))
postRouter.put('/:id', updatePostMiddlewares, postsControllers.updatePostController.bind(postsControllers))
postRouter.delete('/:id', deletePostMiddlewares, postsControllers.deletePostController.bind(postsControllers))