import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../../utils/utils';   
import { postsQueryRepository } from '../PostRepository/postQueryRepository';
import { ResErrorsSwitch } from '../../../utils/ErResSwitch';

export const postIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const foundPost = await postsQueryRepository.getPostByIdRepositories(req.params.id)
    if(!foundPost){return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID)}
    next();
    return
}
export const postPostIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const foundPost = await postsQueryRepository.getPostByIdRepositories(req.params.postId)
    if(!foundPost){return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.POST_NOT_FOUND_POST_ID)}
    next();
    return
}
 