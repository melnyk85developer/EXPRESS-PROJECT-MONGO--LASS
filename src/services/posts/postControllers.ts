import { Response } from 'express';
import { URIParamsOnePostIdModel, URIParamsPostIdModel } from './Post_DTO/URIParamsPostIdModel';
import { INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { CreatePostModel } from './Post_DTO/CreatePostModel';
import { postsQueryRepository } from './PostRepository/postQueryRepository';
import { postsServices } from './postsServices';
import { CreateCommentModel } from '../comments/Comment_DTO/CreateCommentModel';
import { commentsServices } from '../comments/commentsServices';
import { commentsQueryRepository } from '../comments/CommentRepository/commentsQueryRepository';
import { CommentType, ResponseCommentsType } from '../comments/Comment_DTO/commentType';
import { PostType, ResponsePostsType } from './Post_DTO/postType';
import { UpdatePostModel } from './Post_DTO/UpdatePostModel';
import { URIParamsOnePostIdAllCommentsModel } from '../comments/Comment_DTO/URIParamsCommentIdModel';
import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
import { ResErrorsSwitch } from '../../shared/utils/ErResSwitch';
import { RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../shared/types/typesGeneric';

export class PostsControllers {
    async getAllPostsController(req: RequestWithParams<URIParamsOnePostIdModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponsePostsType | null>) {
        return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, await postsQueryRepository.getAllPostsRepositories(req))
    }
    async getPostByIdController(req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostType | number>) {
        const foundPost: PostType | null = await postsQueryRepository.getPostByIdRepositories(req.params.id);
        if (foundPost && foundPost.id) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, foundPost)
        } else {
            return ResErrorsSwitch(res, 0, foundPost as unknown as string)
        }
    }
    async createPostController(req: RequestWithParams<CreatePostModel>, res: Response<PostType | null>) {
        const createPost = await postsServices.createPostServices(req.body)
        if (createPost && createPost.acknowledged) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST, undefined, await postsQueryRepository.getPostByIdRepositories(createPost.insertedId as unknown as string))
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_NO_BLOG_TO_CREATE_THIS_POST)
        }
    }
    async getAllCommentsByPostIdController(req: RequestWithParams<URIParamsOnePostIdAllCommentsModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponseCommentsType | null>) {
        const foundPost: PostType = await postsQueryRepository.getPostByIdRepositories(req.params.postId)
        if (foundPost.id) {
            const comments = await commentsQueryRepository.getAllCommentssRepository(req.params.postId, req.query)
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, comments)
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_NO_POST_FOR_THIS_COMMENTS)
        }
    }
    async createCommentByPostIdController(req: RequestWithParams<CreateCommentModel>, res: Response<CommentType>){
        const createCommentOnePost = await commentsServices.createCommentOnePostServices(req);
        if (createCommentOnePost && createCommentOnePost.acknowledged) {
            const foundComment = await commentsQueryRepository.getCommentByIdRepository(createCommentOnePost.insertedId as unknown as string)
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_COMMENT, undefined, foundComment)
        } else {
            return ResErrorsSwitch(res, 0, 'При получении созданого комментария произошла не известная ошибка!')
        }
    }
    async updatePostController(req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>, res: Response<PostType>){
        const updatePost = await postsServices.updatePostServices(req.params.id, req.body)
        if (updatePost && updatePost.acknowledged) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_UPDATED_POST)
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_UPDATED_POST)
        }
    }
    async deletePostController(req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostType>){
        const isDeletedPost = await postsServices.deletePostServices(req.params.id);
        if (isDeletedPost && isDeletedPost.acknowledged) {
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_DELETED_POST)
        } else {
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_POST)
        }
    }
}
export const postsController = new PostsControllers()