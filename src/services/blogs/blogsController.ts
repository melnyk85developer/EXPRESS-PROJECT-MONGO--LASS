import "reflect-metadata"
import express, { Response } from 'express';
import { QueryBlogModel } from './Blogs_DTO/QueryBlogsModel';
import { UpdateBlogModel } from './Blogs_DTO/UpdateBlogModel';
import { URIParamsBlogIdModel } from './Blogs_DTO/URIParamsBlogIdModel';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { CreatePostModel } from '../posts/Post_DTO/CreatePostModel';
import { URIParamsOnePostIdModel } from '../posts/Post_DTO/URIParamsPostIdModel';
import { CreateBlogModel } from './Blogs_DTO/CreateBlogModel';
import { BlogsType, ResponseBlogType } from './Blogs_DTO/blogTypes';
import { PostType, ResponsePostsType } from '../posts/Post_DTO/postType';
import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
import { ResErrorsSwitch } from '../../shared/utils/ErResSwitch';
import { RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../shared/types/typesGeneric';
import { injectable } from 'inversify';
import { PostsQueryRepository } from '../posts/PostRepository/postQueryRepository';
import { BlogsQueryRepository } from './BlogsRepository/blogQueryRepository';
import { PostsServices } from '../posts/postsServices';
import { BlogsServices } from './blogsServices';

@injectable()
export class BlogsControllers {
    constructor(
        // @inject(TYPES.PostsQueryRepository)
        protected postsQueryRepository: PostsQueryRepository,
        // @inject(TYPES.BlogsQueryRepository)
        protected blogsQueryRepository: BlogsQueryRepository,
        // @inject(TYPES.PostsServices)
        protected postsServices: PostsServices,
        // @inject(TYPES.BlogsServices)
        protected blogsServices: BlogsServices,
    ) { }

    async getBlogsController(req: RequestWithQuery<QueryBlogModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponseBlogType | null>) {
        return SuccessfulResponse(
            res, 
            HTTP_STATUSES.OK_200, 
            undefined, 
            await this.blogsQueryRepository.getAllBlogsRepository(req)
        )
    }
    async getBlogIdAllPostsController(req: RequestWithParams<URIParamsOnePostIdModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponsePostsType>) {
        return SuccessfulResponse(
            res, 
            INTERNAL_STATUS_CODE.SUCCESS, 
            undefined, 
            await this.postsQueryRepository.getAllPostsRepositories(req)
        )
    }
    async getBlogByIdController(req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogsType>) {
        return SuccessfulResponse(
            res, 
            INTERNAL_STATUS_CODE.SUCCESS, 
            undefined, 
            await this.blogsQueryRepository.getBlogByIdRepository(req.params.id)
        )
    }
    async createBlogController(req: RequestWithParams<CreateBlogModel>, res: Response<BlogsType | null>) {
        const createBlog = await this.blogsServices.createBlogServices(req.body)
        if (createBlog && createBlog.acknowledged === true) {
            return SuccessfulResponse(
                res, 
                INTERNAL_STATUS_CODE.SUCCESS_CREATED_BLOG, 
                undefined, 
                await this.blogsQueryRepository.getBlogByIdRepository(createBlog.insertedId as unknown as string)
            )
        } else {
            return ResErrorsSwitch(res, createBlog)
        }
    }
    async createPostOneBlogController(req: RequestWithParams<CreatePostModel>, res: Response<PostType | null>) {
        const createPostOneBlog = await this.postsServices.createPostOneBlogServices(req);
        if (createPostOneBlog && createPostOneBlog.acknowledged === true) {
            return SuccessfulResponse(
                res, 
                INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST, 
                undefined, 
                await this.postsQueryRepository.getPostByIdRepositories(createPostOneBlog!.insertedId as unknown as string)
            )
        } else {
            return ResErrorsSwitch(res, createPostOneBlog)
        }
    }
    async updateBlogController(req: RequestWithParamsAndBody<URIParamsBlogIdModel, UpdateBlogModel>, res: Response<BlogsType | any>) {
        const updateBlog = await this.blogsServices.updateBlogServices(req.params.id, req.body);
        if (updateBlog && updateBlog.acknowledged === true) {
            return SuccessfulResponse(
                res, 
                INTERNAL_STATUS_CODE.SUCCESS_UPDATED_BLOG, 
                undefined, 
                await this.postsQueryRepository.getPostByIdRepositories(updateBlog!.insertedId as unknown as string)
            )
        } else {
            return ResErrorsSwitch(res, updateBlog)
        }
    }
    async deleteBlogController(req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogsType>) {
        const blog = await this.blogsServices.deleteBlogServices(req.params.id);
        if (blog && blog.acknowledged === true) {
            return SuccessfulResponse(
                res, 
                INTERNAL_STATUS_CODE.SUCCESS_DELETED_BLOG
            )
        } else {
            return ResErrorsSwitch(res, blog)
        }
    }
}
