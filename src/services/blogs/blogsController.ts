import express, {Response} from 'express';
import { QueryBlogModel } from './Blogs_DTO/QueryBlogsModel';
import { UpdateBlogModel } from './Blogs_DTO/UpdateBlogModel';
import { URIParamsBlogIdModel } from './Blogs_DTO/URIParamsBlogIdModel';
import { RequestWithQuery, RequestWithParams, RequestWithParamsAndBody } from '../../types/typesGeneric';
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from '../../utils/utils';
import { blogsServices } from "./blogsServices";
import { postsQueryRepository } from '../posts/PostRepository/postQueryRepository';
import { blogsQueryRepository } from './BlogsRepository/blogQueryRepository';
import { CreatePostModel } from '../posts/Post_DTO/CreatePostModel';
import { URIParamsOnePostIdModel } from '../posts/Post_DTO/URIParamsPostIdModel';
import { CreateBlogModel } from './Blogs_DTO/CreateBlogModel';
import { postsServices } from '../posts/postsServices';
import { BlogsType, ResponseBlogType } from './Blogs_DTO/blogTypes';
import { PostType, ResponsePostsType } from '../posts/Post_DTO/postType';
import { SuccessfulResponse } from '../../utils/SuccessfulResponse';
import { ResErrorsSwitch } from '../../utils/ErResSwitch';
import { deleteBlogMiddlewares, getBlogIdAllPostsMiddlewares, getBlogIdMiddlewares, getBlogsMiddlewares, postBlogIdOnePostMiddlewares, postBlogMiddlewares, updateBlogMiddlewares } from './BlogsMiddlewares/blogArrayMiddlewares';

export const blogsControllers = () => {
    const router = express.Router()
    router.get('/', getBlogsMiddlewares, async (req: RequestWithQuery<QueryBlogModel> & RequestWithQuery<{[key: string]: string | undefined}>, res: Response<ResponseBlogType | null>) => {
        return SuccessfulResponse(res, HTTP_STATUSES.OK_200, undefined, await blogsQueryRepository.getAllBlogsRepository(req))
    })
    router.get('/:blogId/posts', getBlogIdAllPostsMiddlewares, async (req: RequestWithParams<URIParamsOnePostIdModel> & RequestWithQuery<{[key: string]: string | undefined}>, res: Response<ResponsePostsType>) => {
        return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, await postsQueryRepository.getAllPostsRepositories(req))
    })
    router.get('/:id', getBlogIdMiddlewares, async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogsType>) => {
        return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, await blogsQueryRepository.getBlogByIdRepository(req.params.id))
    })
    router.post('/', postBlogMiddlewares, async (req: RequestWithParams<CreateBlogModel>, res: Response<BlogsType | null>) => {
        const createBlog = await blogsServices.createBlogServices(req.body)
        if(createBlog && createBlog.acknowledged === true){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_BLOG, undefined, await blogsQueryRepository.getBlogByIdRepository(createBlog.insertedId  as unknown as string))
        }else{
            return ResErrorsSwitch(res, createBlog)
        }
    })
    router.post('/:blogId/posts', postBlogIdOnePostMiddlewares, async (req: RequestWithParams<CreatePostModel>, res: Response<PostType | null>) => {
        const createPostOneBlog = await postsServices.createPostOneBlogServices(req);
        if(createPostOneBlog && createPostOneBlog.acknowledged === true){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST, undefined, await postsQueryRepository.getPostByIdRepositories(createPostOneBlog!.insertedId as unknown as string))
        }else{
            return ResErrorsSwitch(res, createPostOneBlog)
        }
    })
    router.put('/:id', updateBlogMiddlewares, async(req: RequestWithParamsAndBody<URIParamsBlogIdModel, UpdateBlogModel>, res: Response<BlogsType | any>) => {
        const updateBlog = await blogsServices.updateBlogServices(req.params.id, req.body);
        if(updateBlog && updateBlog.acknowledged === true){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_UPDATED_BLOG, undefined, await postsQueryRepository.getPostByIdRepositories(updateBlog!.insertedId as unknown as string))
        }else{
            return ResErrorsSwitch(res, updateBlog)
        }
    })
    router.delete('/:id', deleteBlogMiddlewares, async (req: RequestWithParams<URIParamsBlogIdModel>, res: Response<BlogsType>) => {
        const blog = await blogsServices.deleteBlogServices(req.params.id);
        if(blog && blog.acknowledged === true){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_DELETED_BLOG)
        }else{
            return ResErrorsSwitch(res, blog)
        }
    })
    return router
}
