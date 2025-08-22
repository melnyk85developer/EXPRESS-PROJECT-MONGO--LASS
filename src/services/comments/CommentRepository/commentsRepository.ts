import { InsertOneResult, ObjectId, UpdateResult } from "mongodb";
import { commentsCollection } from "../../../db";
import { CreateCommentModel } from "../Comment_DTO/CreateCommentModel";
import { UpdateCommentModel } from "../Comment_DTO/UpdateCommentModel";
import { CommentType } from "../Comment_DTO/commentType";

export class CommentsRepository {
    async createCommentRepository(comment: CreateCommentModel): Promise<InsertOneResult<{ acknowledged: boolean, insertedId: number }> | any> {
        try {
            return await commentsCollection.insertOne(comment)
        } catch (error) {
            // console.error(error)
            return error
        }
    }
    async updateCommentRepository(id: string, body: UpdateCommentModel): Promise<UpdateResult<{ acknowledged: boolean, insertedId: number }> | any> {
        try {
            const updatedComment = await commentsCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        content: body.content
                    }
                }
            )
            return updatedComment
        } catch (error) {
            // console.error(error)
            return error
        }
    }
    async deleteCommentRepository(id: string): Promise<{ acknowledged: boolean, insertedId: number } | any> {
        try {
            const deleteComment = await commentsCollection.deleteOne({ _id: new ObjectId(id) })
            if (deleteComment) {
                return deleteComment
            } else {
                return 404
            }
        } catch (error) {
            // console.error(e)
            return error
        }
    }
    async _getCommentRepository(id: string): Promise<CommentType | any> {
        try {
            const getComment = await commentsCollection.findOne({ _id: new ObjectId(id) })
            if (getComment) {
                return getComment
            }
        } catch (error) {
            // console.error(error)
            return error
        }
    }
    async deleteAllCommentsFromPostRepository(postId: string): Promise<{ acknowledged: boolean, insertedId: number } | any> {
        try {
            const deleteComments = await commentsCollection.deleteMany({ postId: new ObjectId(postId) });
            if (deleteComments.deletedCount > 0) {
                return deleteComments;
            } else {
                // console.log('Комментарии для удаления не найдены.');
                return 404; // Если нет комментариев для удаления, возвращаем 404
            }
        } catch (error) {
            // console.error(error);
            return error;
        }
    }
}
export const commentsRepository = new CommentsRepository()