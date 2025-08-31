import { Response, Request, NextFunction } from 'express';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';
import { ResErrorsSwitch } from '../../../shared/utils/ErResSwitch';
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
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_ID)
        }
        next();
        return
    }
    isBlogIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        const foundBlog = await this.blogsQueryRepository.getBlogByIdRepository(req.params.blogId)
        if (!foundBlog) {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_BLOG_ID)
        }
        next();
        return
    };
}
