import { Response } from 'express';
import { QueryBlogModel } from './Blogs_DTO/QueryBlogsModel';
import { UpdateBlogModel } from './Blogs_DTO/UpdateBlogModel';
import { URIParamsBlogIdModel } from './Blogs_DTO/URIParamsBlogIdModel';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { CreatePostModel } from '../posts/Post_DTO/CreatePostModel';
import { URIParamsOnePostIdModel } from '../posts/Post_DTO/URIParamsPostIdModel';
import { CreateBlogModel } from './Blogs_DTO/CreateBlogModel';
import { BlogsType, ResponseBlogType } from './Blogs_DTO/blogTypes';
import { PostType, ResponsePostsType } from '../posts/Post_DTO/postType';
import { ErRes } from '../../shared/utils/ErRes';
import { RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../shared/types/typesGeneric';
import { inject, injectable } from 'inversify';
import { PostsQueryRepository } from '../posts/PostRepository/postQueryRepository';
import { BlogsQueryRepository } from './BlogsRepository/blogQueryRepository';
import { PostsServices } from '../posts/postsServices';
import { BlogsServices } from './blogsServices';
import { SuccessResponse } from '../../shared/utils/SuccessResponse';

@injectable()
export class BlogsControllers {
    constructor(
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(BlogsQueryRepository) protected blogsQueryRepository: BlogsQueryRepository,
        @inject(PostsServices) protected postsServices: PostsServices,
        @inject(BlogsServices) protected blogsServices: BlogsServices,
    ) { }

    async getBlogsController(req: RequestWithQuery<QueryBlogModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponseBlogType | null>) {
        return SuccessResponse(
            HTTP_STATUSES.OK_200,
            await this.blogsQueryRepository.getAllBlogsRepository(req),
            undefined,
            req,
            res
        )
    }
    async getBlogIdAllPostsController(req: RequestWithParams<URIParamsOnePostIdModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponsePostsType>) {
        return SuccessResponse(
            INTERNAL_STATUS_CODE.SUCCESS,
            await this.postsQueryRepository.getAllPostsRepositories(req),
            undefined,
            req,
            res
        )
    }
    async getBlogByIdController(req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogsType>) {
        return SuccessResponse(
            INTERNAL_STATUS_CODE.SUCCESS,
            await this.blogsQueryRepository.getBlogByIdRepository(req.params.id),
            undefined,
            req,
            res
        )
    }
    async createBlogController(req: RequestWithParams<CreateBlogModel>, res: Response<BlogsType | null>) {
        const createBlog = await this.blogsServices.createBlogServices(req.body)
        if (createBlog && createBlog.acknowledged === true) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_CREATED_BLOG,
                await this.blogsQueryRepository.getBlogByIdRepository(createBlog.insertedId as unknown as string),
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                createBlog,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async createPostOneBlogController(req: RequestWithParams<CreatePostModel>, res: Response<PostType | null>) {
        const createPostOneBlog = await this.postsServices.createPostOneBlogServices(req);
        if (createPostOneBlog && createPostOneBlog.acknowledged === true) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST,
                await this.postsQueryRepository.getPostByIdRepositories(createPostOneBlog!.insertedId as unknown as string),
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                createPostOneBlog,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async updateBlogController(req: RequestWithParamsAndBody<URIParamsBlogIdModel, UpdateBlogModel>, res: Response<BlogsType | any>) {
        const updateBlog = await this.blogsServices.updateBlogServices(req.params.id, req.body);
        if (updateBlog && updateBlog.acknowledged === true) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_UPDATED_BLOG,
                await this.postsQueryRepository.getPostByIdRepositories(updateBlog!.insertedId as unknown as string),
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                updateBlog,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async deleteBlogController(req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogsType>) {
        const blog = await this.blogsServices.deleteBlogServices(req.params.id);
        if (blog && blog.acknowledged === true) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_DELETED_BLOG,
                undefined,
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                blog,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
}
