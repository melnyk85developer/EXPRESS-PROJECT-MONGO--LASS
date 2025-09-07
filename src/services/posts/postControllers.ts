import { Response } from 'express';
import { URIParamsOnePostIdModel, URIParamsPostIdModel } from './Post_DTO/URIParamsPostIdModel';
import { INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { CreatePostModel } from './Post_DTO/CreatePostModel';
import { CreateCommentModel } from '../comments/Comment_DTO/CreateCommentModel';
import { CommentType, ResponseCommentsType } from '../comments/Comment_DTO/commentType';
import { PostType, ResponsePostsType } from './Post_DTO/postType';
import { UpdatePostModel } from './Post_DTO/UpdatePostModel';
import { URIParamsOnePostIdAllCommentsModel } from '../comments/Comment_DTO/URIParamsCommentIdModel';
import { ErRes } from '../../shared/utils/ErRes';
import { RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from '../../shared/types/typesGeneric';
import { inject, injectable } from 'inversify';
import { PostsQueryRepository } from './PostRepository/postQueryRepository';
import { CommentsServices } from '../comments/commentsServices';
import { CommentsQueryRepository } from '../comments/CommentRepository/commentsQueryRepository';
import { PostsServices } from './postsServices';
import { SuccessResponse } from '../../shared/utils/SuccessResponse';

@injectable()
export class PostsControllers {
    constructor(
        @inject(PostsQueryRepository) protected postsQueryRepository: PostsQueryRepository,
        @inject(CommentsServices) protected commentsServices: CommentsServices,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
        @inject(PostsServices) protected postsServices: PostsServices,
    ) { }
    async getAllPostsController(req: RequestWithParams<URIParamsOnePostIdModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponsePostsType | null>) {
        return SuccessResponse(
            INTERNAL_STATUS_CODE.SUCCESS,
            await this.postsQueryRepository.getAllPostsRepositories(req),
            undefined,
            req,
            res
        )
    }
    async getPostByIdController(req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostType | number>) {
        const foundPost: PostType | null = await this.postsQueryRepository.getPostByIdRepositories(req.params.id);
        if (foundPost && foundPost.id) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS,
                foundPost,
                undefined,
                undefined,
                res
            )
        } else {
            return new ErRes(
                foundPost as unknown as number,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async createPostController(req: RequestWithParams<CreatePostModel>, res: Response<PostType | null>) {
        const createPost = await this.postsServices.createPostServices(req.body)
        if (createPost && createPost.acknowledged) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST,
                await this.postsQueryRepository.getPostByIdRepositories(createPost.insertedId as unknown as string),
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_NO_BLOG_TO_CREATE_THIS_POST,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async getAllCommentsByPostIdController(req: RequestWithParams<URIParamsOnePostIdAllCommentsModel> & RequestWithQuery<{ [key: string]: string | undefined }>, res: Response<ResponseCommentsType | null>) {
        const foundPost: PostType = await this.postsQueryRepository.getPostByIdRepositories(req.params.postId)
        if (foundPost.id) {
            const comments = await this.commentsQueryRepository.getAllCommentssRepository(req.params.postId, req.query)
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS,
                comments,
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_NO_POST_FOR_THIS_COMMENTS,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async createCommentByPostIdController(req: RequestWithParams<CreateCommentModel>, res: Response<CommentType>) {
        const createCommentOnePost = await this.commentsServices.createCommentOnePostServices(req);
        // console.log('createCommentByPostIdController: createCommentOnePost', createCommentOnePost)
        if (createCommentOnePost && createCommentOnePost.acknowledged) {
            const foundComment = await this.commentsQueryRepository.getCommentByIdRepository(createCommentOnePost.insertedId as unknown as string)
            // console.log('createCommentByPostIdController: foundComment', foundComment)
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_CREATED_COMMENT,
                foundComment,
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST,
                undefined,
                'При получении созданого комментария произошла не известная ошибка!',
                req,
                res
            )
        }
    }
    async updatePostController(req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>, res: Response<PostType>) {
        const updatePost = await this.postsServices.updatePostServices(req.params.id, req.body)
        if (updatePost && updatePost.acknowledged) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_UPDATED_POST,
                undefined,
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_UPDATED_POST,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async deletePostController(req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostType>) {
        const isDeletedPost = await this.postsServices.deletePostServices(req.params.id);
        if (isDeletedPost && isDeletedPost.acknowledged) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_DELETED_POST,
                undefined,
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_POST,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
}