import { Response, Request, NextFunction } from 'express';
import { INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';   
import { postsQueryRepository } from '../../posts/PostRepository/postQueryRepository';
import { commentsRepository } from '../CommentRepository/commentsRepository';
import { ResErrorsSwitch } from '../../../shared/utils/ErResSwitch';

export const commentIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.params.id){return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT)}
    const foundComment = await commentsRepository._getCommentRepository(req.params.id)
    if(!foundComment){return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND)}
    next()
    return
}
//TODO: проверить params, по default express-validator 
export const commentCommentIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.params.commentId){return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT)}     
    const foundComment = await commentsRepository._getCommentRepository(req.params.commentId)
    if(!foundComment){return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND)}
    const foundPost = await postsQueryRepository.getPostByIdRepositories(foundComment.postId)
    if(!foundPost){return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID)}
    next()
    return
}
 