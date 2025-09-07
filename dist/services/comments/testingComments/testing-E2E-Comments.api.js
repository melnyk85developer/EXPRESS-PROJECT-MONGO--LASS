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
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsE2eTest = void 0;
const utils_1 = require("../../../shared/utils/utils");
const blogsTestManager_1 = require("../../../shared/__tests__/managersTests/blogsTestManager");
const postsTestManager_1 = require("../../../shared/__tests__/managersTests/postsTestManager");
const commentsTestManager_1 = require("../../../shared/__tests__/managersTests/commentsTestManager");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
const testFunctionsUser_1 = require("../../users/testingUsers/testFunctionsUser");
const testFunctionsAuth_1 = require("../../auth/testingAuth/testFunctionsAuth");
const commentsE2eTest = () => {
    describe('E2E-COMMENTS', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const isUser = yield (0, testFunctionsUser_1.isCreatedUser1)(contextTests_1.contextTests.correctUserName1, contextTests_1.contextTests.correctUserEmail1, contextTests_1.contextTests.correctUserPassword1, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const isLogin = yield (0, testFunctionsAuth_1.isLoginUser1)(contextTests_1.contextTests.accessTokenUser1Device1, contextTests_1.contextTests.refreshTokenUser1Device1, contextTests_1.contextTests.correctUserEmail1, contextTests_1.contextTests.correctUserPassword1, contextTests_1.contextTests.userAgent[0], utils_1.HTTP_STATUSES.OK_200);
            const blogData = {
                name: contextTests_1.contextTests.correctBlogNsme1,
                description: contextTests_1.contextTests.correctBlogDescription1,
                websiteUrl: contextTests_1.contextTests.correctWebsiteUrl1
            };
            const resData = yield blogsTestManager_1.blogsTestManager.createBlogs(blogData, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdBlog1 = resData.createdEntity;
            const data = {
                title: contextTests_1.contextTests.correctTitleBlog1Post1,
                shortDescription: contextTests_1.contextTests.shortDescriptionBlog1Post1,
                content: contextTests_1.contextTests.contentBlog1Post1,
                blogId: contextTests_1.contextTests.createdBlog1.id
            };
            const { response } = yield postsTestManager_1.postsTestManager.createPosts(data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdBlog1Post1 = response.body;
        }));
        it('Должен вернуть 200, массив комментариев - should return 200 and comments array', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getAllComments } = yield commentsTestManager_1.commetsTestManager.getAllComments(contextTests_1.contextTests.createdBlog1Post1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getAllComments).toEqual(expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }));
        }));
        it('Должен возвращать 404 для несуществующего комментария - should return 404 for a non-existent comment', () => __awaiter(void 0, void 0, void 0, function* () {
            yield commentsTestManager_1.commetsTestManager.getCommentById(contextTests_1.contextTests.invalidId, utils_1.HTTP_STATUSES.NOT_FOUND_404);
        }));
        it(`Вы не должны создавать комментарии от неавторизованных пользователей! - You shouldn't create a comment by an unauthorized user!`, () => __awaiter(void 0, void 0, void 0, function* () {
            const dataComment = {
                content: contextTests_1.contextTests.contentBlog1Post1Comment1,
                postId: contextTests_1.contextTests.createdBlog1Post1.id
            };
            const { createdComment } = yield commentsTestManager_1.commetsTestManager.createComment(contextTests_1.contextTests.createdBlog1Post1.id, dataComment, contextTests_1.contextTests.invalidToken, utils_1.HTTP_STATUSES.UNAUTHORIZED_401);
            contextTests_1.contextTests.createdBlog1Post1Comment1 = createdComment;
            const { getAllComments } = yield commentsTestManager_1.commetsTestManager.getAllComments(contextTests_1.contextTests.createdBlog1Post1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getAllComments).toEqual(expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }));
        }));
        it(`Не следует создавать комментарий с невалидными исходными данными - You should not create a post with incorrect initial data`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield commentsTestManager_1.commetsTestManager.createComment(contextTests_1.contextTests.createdBlog1Post1.id, {
                content: '',
                postId: ''
            }, contextTests_1.contextTests.accessTokenUser1Device1, utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            const { getAllComments } = yield commentsTestManager_1.commetsTestManager.getAllComments(contextTests_1.contextTests.createdBlog1Post1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getAllComments).toEqual(expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }));
        }));
        it(`Необходимо создать комментарий с правильными исходными данными - it is necessary to create a comment with the correct initial data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                content: contextTests_1.contextTests.contentBlog1Post1Comment1,
                postId: contextTests_1.contextTests.createdBlog1Post1.id
            };
            const { createdComment } = yield commentsTestManager_1.commetsTestManager.createComment(contextTests_1.contextTests.createdBlog1Post1.id, data, contextTests_1.contextTests.accessTokenUser1Device1, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdBlog1Post1Comment1 = createdComment;
            const { getAllComments } = yield commentsTestManager_1.commetsTestManager.getAllComments(contextTests_1.contextTests.createdBlog1Post1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getAllComments).toEqual(expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [contextTests_1.contextTests.createdBlog1Post1Comment1]
            }));
        }));
        it(`Создать еще один комментарий - create another comment`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                content: contextTests_1.contextTests.contentBlog1Post1Comment2,
                postId: contextTests_1.contextTests.createdBlog1Post1.id
            };
            const { createdComment } = yield commentsTestManager_1.commetsTestManager.createComment(contextTests_1.contextTests.createdBlog1Post1.id, data, contextTests_1.contextTests.accessTokenUser1Device1, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdBlog1Post1Comment2 = createdComment;
            const { getAllComments } = yield commentsTestManager_1.commetsTestManager.getAllComments(contextTests_1.contextTests.createdBlog1Post1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getAllComments).toEqual(expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [contextTests_1.contextTests.createdBlog1Post1Comment2, contextTests_1.contextTests.createdBlog1Post1Comment1]
            }));
        }));
        it(`Не следует обновлять комментарий с невалидными данными. - You should not update a comment with incorrect post data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                content: '',
                postId: ''
            };
            yield commentsTestManager_1.commetsTestManager.updateComment(contextTests_1.contextTests.createdBlog1Post1Comment1.id, data, contextTests_1.contextTests.accessTokenUser1Device1, utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            const { getCommentById } = yield commentsTestManager_1.commetsTestManager.getCommentById(contextTests_1.contextTests.createdBlog1Post1Comment1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getCommentById).toEqual(expect.objectContaining(contextTests_1.contextTests.createdBlog1Post1Comment1));
        }));
        it(`Не следует обновлять несуществующий комментарий - You should not update a comment that does not exist`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                content: contextTests_1.contextTests.contentBlog1Post1Comment1,
                postId: contextTests_1.contextTests.createdBlog1Post1.id
            };
            yield commentsTestManager_1.commetsTestManager.updateComment(contextTests_1.contextTests.invalidId, data, contextTests_1.contextTests.accessTokenUser1Device1, utils_1.HTTP_STATUSES.NOT_FOUND_404);
        }));
        it(`Необходимо обновить комментарий с правильными входными данными - should update comment with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedComment = {
                content: contextTests_1.contextTests.contentBlog1Post1Comment1,
                postId: contextTests_1.contextTests.createdBlog1Post1.id
            };
            yield commentsTestManager_1.commetsTestManager.updateComment(contextTests_1.contextTests.createdBlog1Post1Comment1.id, updatedComment, contextTests_1.contextTests.accessTokenUser1Device1, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const { getCommentById } = yield commentsTestManager_1.commetsTestManager.getCommentById(contextTests_1.contextTests.createdBlog1Post1Comment1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getCommentById).toEqual(expect.objectContaining(Object.assign(Object.assign({}, contextTests_1.contextTests.createdBlog1Post1Comment1), { content: updatedComment.content })));
            const { response } = yield commentsTestManager_1.commetsTestManager.getCommentById(contextTests_1.contextTests.createdBlog1Post1Comment2.id, utils_1.HTTP_STATUSES.OK_200);
            expect(response.body).toEqual(expect.objectContaining(contextTests_1.contextTests.createdBlog1Post1Comment2));
        }));
        it(`Следует удалить оба комментария - should delete both comments`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield commentsTestManager_1.commetsTestManager.deleteComment(contextTests_1.contextTests.createdBlog1Post1Comment1.id, contextTests_1.contextTests.accessTokenUser1Device1, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            yield commentsTestManager_1.commetsTestManager.getCommentById(contextTests_1.contextTests.createdBlog1Post1Comment1.id, utils_1.HTTP_STATUSES.NOT_FOUND_404);
            yield commentsTestManager_1.commetsTestManager.deleteComment(contextTests_1.contextTests.createdBlog1Post1Comment2.id, contextTests_1.contextTests.accessTokenUser1Device1, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            yield commentsTestManager_1.commetsTestManager.getCommentById(contextTests_1.contextTests.createdBlog1Post1Comment2.id, utils_1.HTTP_STATUSES.NOT_FOUND_404);
            const { getAllComments } = yield commentsTestManager_1.commetsTestManager.getAllComments(contextTests_1.contextTests.createdBlog1Post1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getAllComments).toEqual(expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }));
        }));
    });
};
exports.commentsE2eTest = commentsE2eTest;
