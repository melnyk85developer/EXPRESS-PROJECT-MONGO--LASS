import { Response, Request, NextFunction } from 'express';
import { blogsQueryRepository } from '../BlogsRepository/blogQueryRepository';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';
import { ResErrorsSwitch } from '../../../shared/utils/ErResSwitch';

export const blogIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const foundBlog = await blogsQueryRepository.getBlogByIdRepository(req.params.id)
    if (!foundBlog) {
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_ID)
    }
    next();
    return
}
export const isBlogIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const foundBlog = await blogsQueryRepository.getBlogByIdRepository(req.params.blogId)
    if (!foundBlog) {
        return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_BLOG_ID)
    }
    next();
    return
};
