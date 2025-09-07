import { Response, Request, NextFunction } from 'express';
import { INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';
import { ErRes } from '../../../shared/utils/ErRes';
import { inject, injectable } from 'inversify';
import { PostsQueryRepository } from '../../posts/PostRepository/postQueryRepository';
import { CommentsRepository } from '../CommentRepository/commentsRepository';

@injectable()
export class СommentsMiddlewares {
    constructor(
        @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
        @inject(CommentsRepository) private commentsRepository: CommentsRepository
    ) { }
    commentIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.id) {
            return new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT,
                undefined,
                undefined,
                req,
                res
            )
        }
        const foundComment = await this.commentsRepository._getCommentRepository(req.params.id)
        if (!foundComment) {
            return new ErRes(
                INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND,
                undefined,
                undefined,
                req,
                res
            )
        }
        next()
        return
    }
    commentCommentIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.commentId) {
            return new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT,
                undefined,
                undefined,
                req,
                res
            )
        }
        const foundComment = await this.commentsRepository._getCommentRepository(req.params.commentId)
        if (!foundComment) {
            return new ErRes(
                INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND,
                undefined,
                undefined,
                req,
                res
            )
        }
        const foundPost = await this.postsQueryRepository.getPostByIdRepositories(foundComment.postId)
        if (!foundPost) {
            return new ErRes(
                INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID,
                undefined,
                undefined,
                req,
                res
            )
        }
        next()
        return
    }
} 
