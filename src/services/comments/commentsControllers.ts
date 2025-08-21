import express, { Response } from 'express';
import { URIParamsCommentIdModel, URIParamsUpdateDeleteCommentIdModel } from './Comment_DTO/URIParamsCommentIdModel';
import { RequestWithParams, RequestWithParamsAndBody } from '../../types/typesGeneric';
import { INTERNAL_STATUS_CODE } from '../../utils/utils';
import { commentsServices } from './commentsServices';
import { commentsQueryRepository } from './CommentRepository/commentsQueryRepository';
import { UpdateCommentModel } from './Comment_DTO/UpdateCommentModel';
import { CommentType } from './Comment_DTO/commentType';
import { SuccessfulResponse } from '../../utils/SuccessfulResponse';
import { ResErrorsSwitch } from '../../utils/ErResSwitch';
import { deleteCommentMiddlewares, getCommentIdMiddlewares, updateCommentMiddlewares } from './CommentMiddlewares/commentArrayMiddlewares';

export const commentsControllers = () => {
    const router = express.Router()
    router.get('/:id', getCommentIdMiddlewares, async (req: RequestWithParams<URIParamsCommentIdModel>, res: Response<CommentType>) => {
        const foundComment: CommentType | null = await commentsQueryRepository.getCommentByIdRepository(req.params.id);
        if(foundComment && foundComment.id){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, foundComment)
        }else{
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.NOT_FOUND)
        }
    })
    router.put('/:commentId', updateCommentMiddlewares, async(req: RequestWithParamsAndBody<URIParamsUpdateDeleteCommentIdModel, UpdateCommentModel>, res: Response<any>) => {
        const updateComment = await commentsServices.updateCommentServices(req.params.commentId, req.user!.id, req.body)
        if(updateComment.acknowledged === true){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_UPDATED_COMMENT)
        }else{
            return ResErrorsSwitch(res, updateComment)
        }   
    })
    router.delete('/:commentId', deleteCommentMiddlewares, async (req: RequestWithParams<URIParamsUpdateDeleteCommentIdModel>, res: Response<any>) => {
        const commsnt = await commentsServices.deleteCommentServices(req.params.commentId, req.user!.id);
        if(commsnt && commsnt.acknowledged === true){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_DELETED_COMMENT)
        }else{
            return ResErrorsSwitch(res, commsnt)
        }
    })
    return router
}