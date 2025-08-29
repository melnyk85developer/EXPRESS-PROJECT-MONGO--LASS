import request from "supertest";
import { app } from "../../../app";
import { HTTP_STATUSES, HttpStatusType } from "../../utils/utils";
import { SETTINGS } from "../../settings";
import { CreatePostModel } from "../../../services/posts/Post_DTO/CreatePostModel";

export const getRequest = () => {
    return request(app)
}

export const postsTestManager = {
    async getAllPosts(expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200){
        const response = await getRequest()
            .get(SETTINGS.RouterPath.posts)
            // .set('User-Agent', 'TestDevice/1.0')
            .expect(expectedStatusCode)

        let getAllPosts;
        getAllPosts = response.body;
        return { response: response, getAllPosts: getAllPosts }
    },
    async getPostsById(
        postId: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200){

        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.posts}/${postId}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .expect(expectedStatusCode)

        let getPostsById;

        return { response: response, getPostsById: response.body }
    },
    async getAllPostsByIdBlog(
        data: CreatePostModel,
        codedAuth: string | undefined = undefined,
        // accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200){

        const response = await getRequest()
            .get(SETTINGS.RouterPath.posts)
            // .set('User-Agent', 'TestDevice/1.0')
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Authorization', `Basic ${codedAuth}`)
            .send(data)
            .expect(expectedStatusCode)

        let getAllPostsByIdBlog;

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            getAllPostsByIdBlog = response.body;
            expect(getAllPostsByIdBlog).toEqual({
                id: expect.any(String),
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId,
                blogName: expect.any(String),
                createdAt: expect.any(String)
            });
        }

        return { response: response, getAllPostsByIdBlog: getAllPostsByIdBlog }
    },
    async createPosts(
        data: CreatePostModel,
        codedAuth: string | null,
        // accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201){

        const response = await getRequest()
            .post(SETTINGS.RouterPath.posts)
            // .set('Authorization', `Bearer ${accessToken}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Basic ${codedAuth}`)
            .send(data)
            .expect(expectedStatusCode)

        let createdEntity;

        if (expectedStatusCode === HTTP_STATUSES.UNAUTHORIZED_401) {
            expect(expectedStatusCode)
        }

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                id: expect.any(String),
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId,
                blogName: expect.any(String),
                createdAt: expect.any(String)
            });
        }

        return { response: response, createdEntity: createdEntity }
    },
    async updatePosts(
        id: string,
        data: any,
        codedAuth: string | undefined = undefined,
        // accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201){
// console.log('postsTestManager: updatePosts: - postId', postId)
        const response = await getRequest()
            .put(`${SETTINGS.RouterPath.posts}/${id}`)
            // .set('User-Agent', 'TestDevice/1.0')
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Authorization', `Basic ${codedAuth}`)
            .send(data)
            .expect(expectedStatusCode)

        return { response: response, updatePosts: response.body }
    },
    async deletePost(
        postId: string,
        codedAuth: string | undefined = undefined,
        // accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204){

        const response = await getRequest()
            .delete(`${SETTINGS.RouterPath.posts}/${postId}`)
            // .set('User-Agent', 'TestDevice/1.0')
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Authorization', `Basic ${codedAuth}`)
            .expect(expectedStatusCode)

        let deletedPost;

        return { response: response, deletedPost: deletedPost }
    }
}
// cookies: string[] = [],  // Куки передаются сюда вместо авторизации
// .set('Cookie', cookies)  // Устанавливаем куки для запроса