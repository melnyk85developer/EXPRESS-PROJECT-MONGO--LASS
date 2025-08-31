import { Response, Request, NextFunction } from 'express';
import { INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';
import { ResErrorsSwitch } from '../../../shared/utils/ErResSwitch';
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
            return ResErrorsSwitch(
                res,
                INTERNAL_STATUS_CODE.BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT
            )
        }
        const foundComment = await this.commentsRepository._getCommentRepository(req.params.id)
        if (!foundComment) {
            return ResErrorsSwitch(
                res, 
                INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND
            )
        }
        next()
        return
    }
    commentCommentIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.params.commentId) {
            return ResErrorsSwitch(
                res, 
                INTERNAL_STATUS_CODE.BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT
            )
        }
        const foundComment = await this.commentsRepository._getCommentRepository(req.params.commentId)
        if (!foundComment) {
            return ResErrorsSwitch(
                res, 
                INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND
            )
        }
        const foundPost = await this.postsQueryRepository.getPostByIdRepositories(foundComment.postId)
        if (!foundPost) {
            return ResErrorsSwitch(
                res, 
                INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID
            )
        }
        next()
        return
    }
} 
