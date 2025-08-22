import { InsertOneResult, UpdateResult } from "mongodb";
import { CreateCommentModel } from "./Comment_DTO/CreateCommentModel";
import { UpdateCommentModel } from "./Comment_DTO/UpdateCommentModel";
import { commentsRepository } from "./CommentRepository/commentsRepository";
import { INTERNAL_STATUS_CODE } from "../../shared/utils/utils";
import { RequestWithParams } from "../../shared/types/typesGeneric";

export class CommentsServices {
    async createCommentOnePostServices(req: RequestWithParams<CreateCommentModel>): Promise<InsertOneResult<{ acknowledged: boolean, insertedId: number }> | null> {
        const { content } = req.body;
        const date = new Date();
        // date.setMilliseconds(0);
        const createdAt = date.toISOString();
        const createComments = {
            postId: req.params.postId,
            content: content,
            commentatorInfo: {
                userId: req.user!.id,
                userLogin: req.user!.login
            },
            createdAt: createdAt
        }
        const isIdCreateComment = await commentsRepository.createCommentRepository(createComments as unknown as CreateCommentModel)
        if (isIdCreateComment) {
            return isIdCreateComment
        } else {
            return null
        }
    }
    async updateCommentServices(commentId: string, userId: string, body: UpdateCommentModel): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number | null }> | number | any> {
        const comment = await commentsRepository._getCommentRepository(commentId)
        if (comment.commentatorInfo.userId === userId) {
            const updatedPost = {
                content: body.content,
                postId: comment.postId
            }
            return await commentsRepository.updateCommentRepository(commentId, updatedPost)
        } else {
            return INTERNAL_STATUS_CODE.FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_COMMENT
        }
    }
    async deleteCommentServices(id: string, userId: string): Promise<{ acknowledged: boolean, deletedCount: number } | any> {
        const comment = await commentsRepository._getCommentRepository(id)
        if (comment.commentatorInfo.userId === userId) {
            return await commentsRepository.deleteCommentRepository(id)
        } else {
            return INTERNAL_STATUS_CODE.FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_COMMENT
        }
    }
}
export const commentsServices = new CommentsServices()
