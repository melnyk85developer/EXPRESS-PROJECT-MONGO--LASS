"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsTestManager = exports.getRequest = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const utils_1 = require("../../utils/utils");
const settings_1 = require("../../settings");
const getRequest = () => {
    return (0, supertest_1.default)(app_1.app);
};
exports.getRequest = getRequest;
exports.postsTestManager = {
    getAllPosts() {
        return __awaiter(this, arguments, void 0, function* (expectedStatusCode = utils_1.HTTP_STATUSES.OK_200) {
            const response = yield (0, exports.getRequest)()
                .get(settings_1.SETTINGS.RouterPath.posts)
                // .set('User-Agent', 'TestDevice/1.0')
                .expect(expectedStatusCode);
            let getAllPosts;
            getAllPosts = response.body;
            return { response: response, getAllPosts: getAllPosts };
        });
    },
    getPostsById(postId_1) {
        return __awaiter(this, arguments, void 0, function* (postId, expectedStatusCode = utils_1.HTTP_STATUSES.OK_200) {
            const response = yield (0, exports.getRequest)()
                .get(`${settings_1.SETTINGS.RouterPath.posts}/${postId}`)
                // .set('User-Agent', 'TestDevice/1.0')
                .expect(expectedStatusCode);
            let getPostsById;
            return { response: response, getPostsById: response.body };
        });
    },
    getAllPostsByIdBlog(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, codedAuth = undefined, 
        // accessToken: string | undefined = undefined,
        expectedStatusCode = utils_1.HTTP_STATUSES.OK_200) {
            const response = yield (0, exports.getRequest)()
                .get(settings_1.SETTINGS.RouterPath.posts)
                // .set('User-Agent', 'TestDevice/1.0')
                // .set('Authorization', `Bearer ${accessToken}`)
                .set('Authorization', `Basic ${codedAuth}`)
                .send(data)
                .expect(expectedStatusCode);
            let getAllPostsByIdBlog;
            if (expectedStatusCode === utils_1.HTTP_STATUSES.CREATED_201) {
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
            return { response: response, getAllPostsByIdBlog: getAllPostsByIdBlog };
        });
    },
    createPosts(data_1, codedAuth_1) {
        return __awaiter(this, arguments, void 0, function* (data, codedAuth, 
        // accessToken: string | undefined = undefined,
        expectedStatusCode = utils_1.HTTP_STATUSES.CREATED_201) {
            const response = yield (0, exports.getRequest)()
                .post(settings_1.SETTINGS.RouterPath.posts)
                // .set('Authorization', `Bearer ${accessToken}`)
                // .set('User-Agent', 'TestDevice/1.0')
                .set('Authorization', `Basic ${codedAuth}`)
                .send(data)
                .expect(expectedStatusCode);
            let createdEntity;
            if (expectedStatusCode === utils_1.HTTP_STATUSES.UNAUTHORIZED_401) {
                expect(expectedStatusCode);
            }
            if (expectedStatusCode === utils_1.HTTP_STATUSES.CREATED_201) {
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
            return { response: response, createdEntity: createdEntity };
        });
    },
    updatePosts(id_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (id, data, codedAuth = undefined, 
        // accessToken: string | undefined = undefined,
        expectedStatusCode = utils_1.HTTP_STATUSES.CREATED_201) {
            // console.log('postsTestManager: updatePosts: - postId', postId)
            const response = yield (0, exports.getRequest)()
                .put(`${settings_1.SETTINGS.RouterPath.posts}/${id}`)
                // .set('User-Agent', 'TestDevice/1.0')
                // .set('Authorization', `Bearer ${accessToken}`)
                .set('Authorization', `Basic ${codedAuth}`)
                .send(data)
                .expect(expectedStatusCode);
            return { response: response, updatePosts: response.body };
        });
    },
    deletePost(postId_1) {
        return __awaiter(this, arguments, void 0, function* (postId, codedAuth = undefined, 
        // accessToken: string | undefined = undefined,
        expectedStatusCode = utils_1.HTTP_STATUSES.NO_CONTENT_204) {
            const response = yield (0, exports.getRequest)()
                .delete(`${settings_1.SETTINGS.RouterPath.posts}/${postId}`)
                // .set('User-Agent', 'TestDevice/1.0')
                // .set('Authorization', `Bearer ${accessToken}`)
                .set('Authorization', `Basic ${codedAuth}`)
                .expect(expectedStatusCode);
            let deletedPost;
            return { response: response, deletedPost: deletedPost };
        });
    }
};
// cookies: string[] = [],  // Куки передаются сюда вместо авторизации
// .set('Cookie', cookies)  // Устанавливаем куки для запроса
