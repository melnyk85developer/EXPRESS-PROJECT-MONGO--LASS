import { Response } from 'express';
import { URIParamsCommentIdModel, URIParamsUpdateDeleteCommentIdModel } from './Comment_DTO/URIParamsCommentIdModel';
import { INTERNAL_STATUS_CODE } from '../../shared/utils/utils';
import { UpdateCommentModel } from './Comment_DTO/UpdateCommentModel';
import { CommentType } from './Comment_DTO/commentType';
// import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
import { ErRes } from '../../shared/utils/ErRes';
import { RequestWithParams, RequestWithParamsAndBody } from '../../shared/types/typesGeneric';
import { inject, injectable } from 'inversify';
import { CommentsServices } from './commentsServices';
import { CommentsQueryRepository } from './CommentRepository/commentsQueryRepository';
import { SuccessResponse } from '../../shared/utils/SuccessResponse';

@injectable()
export class CommentsControllers {
    constructor(
        @inject(CommentsServices) protected commentsServices: CommentsServices,
        @inject(CommentsQueryRepository) protected commentsQueryRepository: CommentsQueryRepository,
    ) { }

    async getCommentByIdController(req: RequestWithParams<URIParamsCommentIdModel>, res: Response<CommentType>) {
        const foundComment: CommentType | null = await this.commentsQueryRepository.getCommentByIdRepository(req.params.id);
        if (foundComment && foundComment.id) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS,
                foundComment,
                undefined,
                req,
                res
            )
        } else {
            return new ErRes(
                INTERNAL_STATUS_CODE.NOT_FOUND,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async updateCommentController(req: RequestWithParamsAndBody<URIParamsUpdateDeleteCommentIdModel, UpdateCommentModel>, res: Response<any>) {
        const updateComment = await this.commentsServices.updateCommentServices(req.params.commentId, req.user!.id, req.body)
        if (updateComment.acknowledged === true) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_UPDATED_COMMENT,
                undefined,
                undefined,
                req,
                res,
            )
        } else {
            return new ErRes(
                updateComment,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
    async deleteCommentController(req: RequestWithParams<URIParamsUpdateDeleteCommentIdModel>, res: Response<any>) {
        const commsnt = await this.commentsServices.deleteCommentServices(req.params.commentId, req.user!.id);
        if (commsnt && commsnt.acknowledged === true) {
            return SuccessResponse(
                INTERNAL_STATUS_CODE.SUCCESS_DELETED_COMMENT,
                undefined,
                undefined,
                req,
                res,
            )
        } else {
            return new ErRes(
                commsnt,
                undefined,
                undefined,
                req,
                res
            )
        }
    }
}