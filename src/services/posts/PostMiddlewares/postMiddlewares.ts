import { body } from 'express-validator';
import { BlogsQueryRepository } from '../../blogs/BlogsRepository/blogQueryRepository';
// import { container } from '../../../shared/container/iocRoot';
import { blogsQueryRepository } from '../../../shared/container/compositionRootCustom';

// const blogsQueryRepository: BlogsQueryRepository = container.resolve(BlogsQueryRepository)

export const postMiddlewares = [
    body('blogId')
        .notEmpty()
        .isString()
        .custom(async blogId => {
        const blog = await blogsQueryRepository.getBlogByIdRepository(blogId)
        if(!blog){
            throw new Error('Блога с таким blogId не найденно!')
    }}),
    body('title')
        .notEmpty()
        .isString()
        .trim()
        .isLength({min: 3, max: 30})
        .withMessage('Минимум 3, максимум 30 символов!'),
    body('shortDescription')
        .notEmpty()
        .isString()
        .trim()
        .isLength({min: 3, max: 100})
        .withMessage('Минимум 3, максимум 100 символов!'),
    body('content')
        .notEmpty()
        .isString()
        .trim()
        .isLength({min: 3, max: 1000})
        .withMessage('Минимум 3, максимум 1000 символов!'),
]
export const postOneBlogMiddlewares = [
    body('title')
        .notEmpty()
        .isString()
        .trim()
        .isLength({min: 3, max: 30})
        .withMessage('Минимум 3, максимум 30 символов!'),
    body('shortDescription')
        .notEmpty()
        .isString()
        .trim()
        .isLength({min: 3, max: 100})
        .withMessage('Минимум 3, максимум 100 символов!'),
    body('content')
        .notEmpty()
        .isString()
        .trim()
        .isLength({min: 3, max: 1000})
        .withMessage('Минимум 3, максимум 1000 символов!'),
]