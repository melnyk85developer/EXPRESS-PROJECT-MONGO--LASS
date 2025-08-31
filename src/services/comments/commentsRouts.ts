import express, { Response } from 'express';
import { deleteCommentMiddlewares, getCommentIdMiddlewares, updateCommentMiddlewares } from './CommentMiddlewares/commentArrayMiddlewares';
import { container } from "../../shared/container/iocRoot";
import { CommentsControllers } from "./commentsControllers";

export const commentsRouter = express.Router()
const commentsControllers: CommentsControllers = container.get(CommentsControllers)

commentsRouter.get('/:id', getCommentIdMiddlewares, commentsControllers.getCommentByIdController.bind(commentsControllers))
commentsRouter.put('/:commentId', updateCommentMiddlewares, commentsControllers.updateCommentController.bind(commentsControllers))
commentsRouter.delete('/:commentId', deleteCommentMiddlewares, commentsControllers.deleteCommentController.bind(commentsControllers))