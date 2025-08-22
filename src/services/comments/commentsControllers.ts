import { Response } from 'express';
import { URIParamsCommentIdModel, URIParamsUpdateDeleteCommentIdModel } from './Comment_DTO/URIParamsCommentIdModel';
import { INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { commentsServices } from './commentsServices';
import { commentsQueryRepository } from './CommentRepository/commentsQueryRepository';
import { UpdateCommentModel } from './Comment_DTO/UpdateCommentModel';
import { CommentType } from './Comment_DTO/commentType';
import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
import { ResErrorsSwitch } from '../../shared/utils/ErResSwitch';
import { RequestWithParams, RequestWithParamsAndBody } from '../../shared/types/typesGeneric';

export class CommentsControllers {
    async getCommentByIdController(req: RequestWithParams<URIParamsCommentIdModel>, res: Response<CommentType>){
        const foundComment: CommentType | null = await commentsQueryRepository.getCommentByIdRepository(req.params.id);
        if(foundComment && foundComment.id){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS, undefined, foundComment)
        }else{
            return ResErrorsSwitch(res, INTERNAL_STATUS_CODE.NOT_FOUND)
        }
    }
    async updateCommentController(req: RequestWithParamsAndBody<URIParamsUpdateDeleteCommentIdModel, UpdateCommentModel>, res: Response<any>){
        const updateComment = await commentsServices.updateCommentServices(req.params.commentId, req.user!.id, req.body)
        if(updateComment.acknowledged === true){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_UPDATED_COMMENT)
        }else{
            return ResErrorsSwitch(res, updateComment)
        }   
    }
    async deleteCommentController(req: RequestWithParams<URIParamsUpdateDeleteCommentIdModel>, res: Response<any>){
        const commsnt = await commentsServices.deleteCommentServices(req.params.commentId, req.user!.id);
        if(commsnt && commsnt.acknowledged === true){
            return SuccessfulResponse(res, INTERNAL_STATUS_CODE.SUCCESS_DELETED_COMMENT)
        }else{
            return ResErrorsSwitch(res, commsnt)
        }
    }
}
export const commentsController = new CommentsControllers()