import express, { Response } from 'express';
import { URIParamsOnePostIdModel, URIParamsPostIdModel } from './Post_DTO/URIParamsPostIdModel';
import { RequestWithQuery, RequestWithParams, RequestWithParamsAndBody } from '../../types/typesGeneric';
import { INTERNAL_STATUS_CODE } from '../../utils/utils';
import { CreatePostModel } from './Post_DTO/CreatePostModel';
import { postsQueryRepository } from './PostRepository/postQueryRepository';
import { inputValidationMiddleware } from '../../middlewares/input-validation-middleware';
import { postIdMiddleware } from './PostMiddlewares/isThereAPostValidation';
import { postsServices } from './postsServices';
import { CreateCommentModel } from '../comments/Comment_DTO/CreateCommentModel';
import { commentsServices } from '../comments/commentsServices';
import { commentsQueryRepository } from '../comments/CommentRepository/commentsQueryRepository';
import { CommentType, ResponseCommentsType } from '../comments/Comment_DTO/commentType';
import { PostType, ResponsePostsType } from './Post_DTO/postType';
import { UpdatePostModel } from './Post_DTO/UpdatePostModel';
import { accessTokenMiddleware, oldAuthGuardMiddleware } from '../auth/AuthMiddlewares/authGuardMiddleware';
import { postMiddlewares } from './PostMiddlewares/postMiddlewares';
import { commentsMiddleware } from '../comments/CommentMiddlewares/commentsMiddlewares';
import { URIParamsOnePostIdAllCommentsModel } from '../comments/Comment_DTO/URIParamsCommentIdModel';
import { SuccessfulResponse } from '../../utils/SuccessfulResponse';
import { ResErrorsSwitch } from '../../utils/ErResSwitch';
import { deletePostMiddlewares, getAllPostMiddlewares, getPostIdAllCommentsMiddlewares, getPostIdMiddlewares, postPostIdCommentsMiddlewares, postPostMiddlewares, updatePostMiddlewares } from './PostMiddlewares/postArrayMiddlewares';

export const postsControllers = () => {
    const router = express.Router()
    router.get('/', getAllPostMiddlewares, async (req: RequestWithParams<URIParamsOnePostIdModel> & RequestWithQuery<{[key: string]: string | undefined}>, res: Response<ResponsePostsType | null>) => {
        return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, await postsQueryRepository.getAllPostsRepositories(req))
    })
    router.get('/:id', getPostIdMiddlewares, async (req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostType | number>) => {
        const foundPost: PostType | null = await postsQueryRepository.getPostByIdRepositories(req.params.id);
        if(foundPost && foundPost.id){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, foundPost)
        }else{
            return ResErrorsSwitch(res, 0, foundPost as unknown as string)
        }
    })
    router.post('/', postPostMiddlewares, async (req: RequestWithParams<CreatePostModel>, res: Response<PostType | null>) => {
        const createPost = await postsServices.createPostServices(req.body)
        if(createPost && createPost.acknowledged){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST, undefined, await postsQueryRepository.getPostByIdRepositories(createPost.insertedId as unknown as string))
        }else{
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_NO_BLOG_TO_CREATE_THIS_POST)
        }
    })
    router.get('/:postId/comments', getPostIdAllCommentsMiddlewares, async (req: RequestWithParams<URIParamsOnePostIdAllCommentsModel> & RequestWithQuery<{[key: string]: string | undefined}>, res: Response<ResponseCommentsType | null>) => {
        const foundPost: PostType = await postsQueryRepository.getPostByIdRepositories(req.params.postId)
        if(foundPost.id){
            const comments = await commentsQueryRepository.getAllCommentssRepository(req.params.postId, req.query)
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, comments)
        }else{
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_NO_POST_FOR_THIS_COMMENTS)
        }
    })
    router.post('/:postId/comments', postPostIdCommentsMiddlewares,
        async (req: RequestWithParams<CreateCommentModel>, res: Response<CommentType>) => {
            const createCommentOnePost = await commentsServices.createCommentOnePostServices(req);
            if(createCommentOnePost && createCommentOnePost.acknowledged){
                const foundComment = await commentsQueryRepository.getCommentByIdRepository(createCommentOnePost.insertedId as unknown as string)
                return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_CREATED_COMMENT, undefined, foundComment)
            }else{
                return ResErrorsSwitch(res, 0, 'При получении созданого комментария произошла не известная ошибка!')
            }
        }
    )
    router.put('/:id', updatePostMiddlewares, async(req: RequestWithParamsAndBody<URIParamsPostIdModel, UpdatePostModel>, res: Response<PostType>) => {
        const updatePost = await postsServices.updatePostServices(req.params.id, req.body)
        if(updatePost && updatePost.acknowledged){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_UPDATED_POST)
        }else{
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_UPDATED_POST)
        }
    })
    router.delete('/:id', deletePostMiddlewares, async (req: RequestWithParams<URIParamsPostIdModel>, res: Response<PostType>) => {
        const isDeletedPost = await postsServices.deletePostServices(req.params.id);
        if(isDeletedPost && isDeletedPost.acknowledged){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_DELETED_POST)
        }else{
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_POST)
        }
    })
    return router
}