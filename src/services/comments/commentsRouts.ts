import express, { Response } from 'express';
import { commentsController } from './commentsControllers';
import { deleteCommentMiddlewares, getCommentIdMiddlewares, updateCommentMiddlewares } from './CommentMiddlewares/commentArrayMiddlewares';

export const commentsRouter = express.Router()

commentsRouter.get('/:id', getCommentIdMiddlewares, commentsController.getCommentByIdController)
commentsRouter.put('/:commentId', updateCommentMiddlewares, commentsController.updateCommentController)
commentsRouter.delete('/:commentId', deleteCommentMiddlewares, commentsController.deleteCommentController)