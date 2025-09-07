import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';
import { ErRes } from '../../../shared/utils/ErRes';
import { inject, injectable } from 'inversify';
import { BlogsQueryRepository } from '../BlogsRepository/blogQueryRepository';

@injectable()
export class BlogValidationMiddlewares {
    constructor(
        @inject(BlogsQueryRepository) private readonly blogsQueryRepository: BlogsQueryRepository
    ) { }
    blogIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const foundBlog = await this.blogsQueryRepository.getBlogByIdRepository(req.params.id)
        if (!foundBlog) {
            return new ErRes(
                INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_ID,
                undefined,
                undefined,
                req,
                res
            )
        }
        next();
        return
    }
    isBlogIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const foundBlog = await this.blogsQueryRepository.getBlogByIdRepository(req.params.blogId)
        if (!foundBlog) {
            return new ErRes(
                INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_BLOG_ID,
                undefined,
                undefined,
                req,
                res
            )
        }
        next();
        return
    };
}
