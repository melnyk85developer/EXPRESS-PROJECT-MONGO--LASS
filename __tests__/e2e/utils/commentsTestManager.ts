import { SETTINGS } from "../../../src/settings";
import {app} from "../../../src/app";
import {HTTP_STATUSES, HttpStatusType} from "../../../src/utils/utils";
import request from "supertest";
import { CreatePostModel } from "../../../src/services/posts/Post_DTO/CreatePostModel";
import { CreateCommentModel } from "../../../src/services/comments/Comment_DTO/CreateCommentModel";
import { UpdateCommentModel } from "../../../src/services/comments/Comment_DTO/UpdateCommentModel";

export const getRequest = () => {
    return request(app)
}
export const commetsTestManager = {
    async getAllComments(
        postId: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200){
        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.posts}/${postId}/comments`)
            // .set('User-Agent', 'TestDevice/1.0')
            .expect(expectedStatusCode)

        let getAllComments;
        getAllComments = response.body;
        return { response: response, getAllComments: getAllComments }
    },
    async getCommentById(
        id: string,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200){
        // console.log('getCommentById - id', id)

        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.comments}/${id}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .expect(expectedStatusCode)

        return { response: response, getCommentById: response.body }
    },
    async getAllCommentsByIdPost(
        data: CreatePostModel,
        accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200){

        const response = await getRequest()
            .get(SETTINGS.RouterPath.comments)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(expectedStatusCode)

        let getAllCommentByIdBlog;
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            getAllCommentByIdBlog = response.body;
            expect(getAllCommentByIdBlog).toEqual({
                id: expect.any(String),
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId,
                blogName: expect.any(String),
                createdAt: expect.any(String)
            })
        }
        return { response: response, getAllPostsByIdBlog: getAllCommentByIdBlog }
    },
    async createComment(
        postId: string,
        dataComment: CreateCommentModel,
        accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201){
    // console.log('commetsTestManager: createComment - accessToken', accessToken)
    // console.log('commetsTestManager: createComment - postId', postId)

        const response = await getRequest()
            .post(`${SETTINGS.RouterPath.posts}/${postId}/comments`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(dataComment)
            .expect(expectedStatusCode)

        let createdComment;
        // console.log('commetsTestManager: createComment - response', response.body)

        if (expectedStatusCode === HTTP_STATUSES.UNAUTHORIZED_401){
            expect(expectedStatusCode)
        }

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdComment = response.body;
            expect(createdComment).toEqual({
                id: expect.any(String),
                commentatorInfo: {
                    userId: expect.any(String),
                    userLogin: expect.any(String),
                },
                content: dataComment.content,
                createdAt: expect.any(String)
            });
        }
        return { response: response, createdComment: createdComment }
    },
    async updateComment(
        commentId: string,
        data: UpdateCommentModel,
        accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201){
        // console.log('commetsTestManager: updatePosts: - commentId', commentId)
        const response = await getRequest()
            .put(`${SETTINGS.RouterPath.comments}/${commentId}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(data)
            .expect(expectedStatusCode)

        return { response: response, updateComment: response.body }
    },
    async deleteComment(
        commentId: string,
        accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204){

        const response = await getRequest()
            .delete(`${SETTINGS.RouterPath.comments}/${commentId}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(expectedStatusCode)

        let deletedComment;

        return { response: response, deletedComment: deletedComment }
    }
}
// cookies: string[] = [],  // Куки передаются сюда вместо авторизации
// .set('Cookie', cookies)  // Устанавливаем куки для запроса