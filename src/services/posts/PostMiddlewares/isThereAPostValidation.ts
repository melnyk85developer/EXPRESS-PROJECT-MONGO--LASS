import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';;
import { ErRes } from '../../../shared/utils/ErRes';
import { inject, injectable } from 'inversify';
import { PostsQueryRepository } from '../PostRepository/postQueryRepository';

@injectable()
export class PostsMiddlewares {
    constructor(
        @inject(PostsQueryRepository) private postsQueryRepository: PostsQueryRepository,
    ) { }
    postIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        // console.log('PostsMiddlewares: postIdMiddleware - req.params.id', req.params.id)
        const foundPost = await this.postsQueryRepository.getPostByIdRepositories(req.params.id)
        // console.log('PostsMiddlewares: postIdMiddleware - foundPost', foundPost)
        if (!foundPost) {
            return new ErRes(
                INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID,
                undefined,
                undefined,
                req,
                res
            )
        }
        next();
        return
    }
    postPostIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        // console.log('PostsMiddlewares: postPostIdMiddleware - postId', req.params.postId)
        const foundPost = await this.postsQueryRepository.getPostByIdRepositories(req.params.postId)
        // console.log('PostsMiddlewares: postPostIdMiddleware - foundPost', foundPost)

        if (!foundPost) {
            return new ErRes(
                INTERNAL_STATUS_CODE.POST_NOT_FOUND_POST_ID,
                undefined,
                undefined,
                req,
                res
            )
        }
        next();
        return
    }
}
