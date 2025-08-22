import express, { Response } from 'express';
import { QueryBlogModel } from './Blogs_DTO/QueryBlogsModel';
import { UpdateBlogModel } from './Blogs_DTO/UpdateBlogModel';
import { URIParamsBlogIdModel } from './Blogs_DTO/URIParamsBlogIdModel';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { postsQueryRepository } from '../posts/PostRepository/postQueryRepository';
import { blogsQueryRepository } from './BlogsRepository/blogQueryRepository';
import { CreatePostModel } from '../posts/Post_DTO/CreatePostModel';
import { URIParamsOnePostIdModel } from '../posts/Post_DTO/URIParamsPostIdModel';
import { CreateBlogModel } from './Blogs_DTO/CreateBlogModel';
import { postsServices } from '../posts/postsServices';
import { BlogsType, ResponseBlogType } from './Blogs_DTO/blogTypes';
import { PostType, ResponsePostsType } from '../posts/Post_DTO/postType';
import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
import { ResErrorsSwitch } from '../../shared/utils/ErResSwitch';
import { RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../shared/types/typesGeneric';
import { blogsServices } from './blogsServices';

export class BlogsControllers {
    async getBlogsController(req: RequestWithQuery<QueryBlogModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponseBlogType | null>) {
        return SuccessfulResponse(res, HTTP_STATUSES.OK_200, undefined, await blogsQueryRepository.getAllBlogsRepository(req))
    }
    async getBlogIdAllPostsController(req: RequestWithParams<URIParamsOnePostIdModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponsePostsType>) {
        return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, await postsQueryRepository.getAllPostsRepositories(req))
    }
    async getBlogByIdController(req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogsType>){
        return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, await blogsQueryRepository.getBlogByIdRepository(req.params.id))
    }
    async createBlogController(req: RequestWithParams<CreateBlogModel>, res: Response<BlogsType | null>){
        const createBlog = await blogsServices.createBlogServices(req.body)
        if (createBlog && createBlog.acknowledged === true) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_BLOG, undefined, await blogsQueryRepository.getBlogByIdRepository(createBlog.insertedId as unknown as string))
        } else {
            return ResErrorsSwitch(res, createBlog)
        }
    }
    async createPostOneBlogController(req: RequestWithParams<CreatePostModel>, res: Response<PostType | null>){
        const createPostOneBlog = await postsServices.createPostOneBlogServices(req);
        if (createPostOneBlog && createPostOneBlog.acknowledged === true) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST, undefined, await postsQueryRepository.getPostByIdRepositories(createPostOneBlog!.insertedId as unknown as string))
        } else {
            return ResErrorsSwitch(res, createPostOneBlog)
        }
    }
    async updateBlogController(req: RequestWithParamsAndBody<URIParamsBlogIdModel, UpdateBlogModel>, res: Response<BlogsType | any>){
        const updateBlog = await blogsServices.updateBlogServices(req.params.id, req.body);
        if (updateBlog && updateBlog.acknowledged === true) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_UPDATED_BLOG, undefined, await postsQueryRepository.getPostByIdRepositories(updateBlog!.insertedId as unknown as string))
        } else {
            return ResErrorsSwitch(res, updateBlog)
        }
    }
    async deleteBlogController(req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogsType>){
        const blog = await blogsServices.deleteBlogServices(req.params.id);
        if (blog && blog.acknowledged === true) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_DELETED_BLOG)
        } else {
            return ResErrorsSwitch(res, blog)
        }
    }
}
export const blogsController = new BlogsControllers()
