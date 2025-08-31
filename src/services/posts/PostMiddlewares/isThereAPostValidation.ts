import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';;
import { ResErrorsSwitch } from '../../../shared/utils/ErResSwitch';
import { inject, injectable } from 'inversify';
import { PostsQueryRepository } from '../PostRepository/postQueryRepository';

@injectable()
export class PostsMiddlewares {
    constructor(
        @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
    ) { }
    postIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const foundPost = await this.postsQueryRepository.getPostByIdRepositories(req.params.id)
        if (!foundPost) {
            return ResErrorsSwitch(
                res,
                INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID
            )
        }
        next();
        return
    }
    postPostIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const foundPost = await this.postsQueryRepository.getPostByIdRepositories(req.params.postId)
        if (!foundPost) {
            return ResErrorsSwitch(
                res,
                INTERNAL_STATUS_CODE.POST_NOT_FOUND_POST_ID
            )
        }
        next();
        return
    }
}
