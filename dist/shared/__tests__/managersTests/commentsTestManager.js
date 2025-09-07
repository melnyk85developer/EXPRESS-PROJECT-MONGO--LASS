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
exports.commetsTestManager = exports.getRequest = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const utils_1 = require("../../utils/utils");
const settings_1 = require("../../settings");
const getRequest = () => {
    return (0, supertest_1.default)(app_1.app);
};
exports.getRequest = getRequest;
exports.commetsTestManager = {
    getAllComments(postId_1) {
        return __awaiter(this, arguments, void 0, function* (postId, expectedStatusCode = utils_1.HTTP_STATUSES.OK_200) {
            const response = yield (0, exports.getRequest)()
                .get(`${settings_1.SETTINGS.RouterPath.posts}/${postId}/comments`)
                // .set('User-Agent', 'TestDevice/1.0')
                .expect(expectedStatusCode);
            let getAllComments;
            getAllComments = response.body;
            return { response: response, getAllComments: getAllComments };
        });
    },
    getCommentById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, expectedStatusCode = utils_1.HTTP_STATUSES.OK_200) {
            // console.log('getCommentById - id', id)
            const response = yield (0, exports.getRequest)()
                .get(`${settings_1.SETTINGS.RouterPath.comments}/${id}`)
                // .set('User-Agent', 'TestDevice/1.0')
                .expect(expectedStatusCode);
            return { response: response, getCommentById: response.body };
        });
    },
    getAllCommentsByIdPost(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, accessToken = undefined, expectedStatusCode = utils_1.HTTP_STATUSES.OK_200) {
            const response = yield (0, exports.getRequest)()
                .get(settings_1.SETTINGS.RouterPath.comments)
                // .set('User-Agent', 'TestDevice/1.0')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(data)
                .expect(expectedStatusCode);
            let getAllCommentByIdBlog;
            if (expectedStatusCode === utils_1.HTTP_STATUSES.CREATED_201) {
                getAllCommentByIdBlog = response.body;
                expect(getAllCommentByIdBlog).toEqual({
                    id: expect.any(String),
                    title: data.title,
                    shortDescription: data.shortDescription,
                    content: data.content,
                    blogId: data.blogId,
                    blogName: expect.any(String),
                    createdAt: expect.any(String)
                });
            }
            return { response: response, getAllPostsByIdBlog: getAllCommentByIdBlog };
        });
    },
    createComment(postId_1, dataComment_1, accessToken_1) {
        return __awaiter(this, arguments, void 0, function* (postId, dataComment, accessToken, expectedStatusCode = utils_1.HTTP_STATUSES.CREATED_201) {
            // console.log('commetsTestManager: createComment - accessToken', accessToken)
            // console.log('commetsTestManager: createComment - postId', postId)
            const response = yield (0, exports.getRequest)()
                .post(`${settings_1.SETTINGS.RouterPath.posts}/${postId}/comments`)
                // .set('User-Agent', 'TestDevice/1.0')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(dataComment)
                .expect(expectedStatusCode);
            let createdComment;
            // console.log('commetsTestManager: createComment - response', response.body)
            if (expectedStatusCode === utils_1.HTTP_STATUSES.UNAUTHORIZED_401) {
                expect(expectedStatusCode);
            }
            if (expectedStatusCode === utils_1.HTTP_STATUSES.CREATED_201) {
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
            return { response: response, createdComment: createdComment };
        });
    },
    updateComment(commentId_1, data_1, accessToken_1) {
        return __awaiter(this, arguments, void 0, function* (commentId, data, accessToken, expectedStatusCode = utils_1.HTTP_STATUSES.CREATED_201) {
            // console.log('commetsTestManager: updatePosts: - commentId', commentId)
            const response = yield (0, exports.getRequest)()
                .put(`${settings_1.SETTINGS.RouterPath.comments}/${commentId}`)
                // .set('User-Agent', 'TestDevice/1.0')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(data)
                .expect(expectedStatusCode);
            return { response: response, updateComment: response.body };
        });
    },
    deleteComment(commentId_1, accessToken_1) {
        return __awaiter(this, arguments, void 0, function* (commentId, accessToken, expectedStatusCode = utils_1.HTTP_STATUSES.NO_CONTENT_204) {
            const response = yield (0, exports.getRequest)()
                .delete(`${settings_1.SETTINGS.RouterPath.comments}/${commentId}`)
                // .set('User-Agent', 'TestDevice/1.0')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(expectedStatusCode);
            let deletedComment;
            return { response: response, deletedComment: deletedComment };
        });
    }
};
