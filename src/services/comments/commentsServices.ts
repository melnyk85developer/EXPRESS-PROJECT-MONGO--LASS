import { InsertOneResult, UpdateResult } from "mongodb";
import { CreateCommentModel } from "./Comment_DTO/CreateCommentModel";
import { UpdateCommentModel } from "./Comment_DTO/UpdateCommentModel";
import { INTERNAL_STATUS_CODE } from "../../shared/utils/utils";
import { RequestWithParams } from "../../shared/types/typesGeneric";
import { inject, injectable } from "inversify";
import { CommentsRepository } from "./CommentRepository/commentsRepository";

@injectable()
export class CommentsServices {
    constructor(
        @inject(CommentsRepository) protected commentsRepository: CommentsRepository
    ) { }
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
        const isIdCreateComment = await this.commentsRepository.createCommentRepository(createComments as unknown as CreateCommentModel)
        if (isIdCreateComment) {
            return isIdCreateComment
        } else {
            return null
        }
    }
    async updateCommentServices(commentId: string, userId: string, body: UpdateCommentModel): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number | null }> | number | any> {
        const comment = await this.commentsRepository._getCommentRepository(commentId)
        if (comment.commentatorInfo.userId === userId) {
            const updatedPost = {
                content: body.content,
                postId: comment.postId
            }
            return await this.commentsRepository.updateCommentRepository(commentId, updatedPost)
        } else {
            return INTERNAL_STATUS_CODE.FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_COMMENT
        }
    }
    async deleteCommentServices(id: string, userId: string): Promise<{ acknowledged: boolean, deletedCount: number } | any> {
        const comment = await this.commentsRepository._getCommentRepository(id)
        if (comment.commentatorInfo.userId === userId) {
            return await this.commentsRepository.deleteCommentRepository(id)
        } else {
            return INTERNAL_STATUS_CODE.FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_COMMENT
        }
    }
}
