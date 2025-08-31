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
exports.postsE2eTest = void 0;
const settings_1 = require("../../../shared/settings");
const utils_1 = require("../../../shared/utils/utils");
const postsTestManager_1 = require("../../../shared/__tests__/managersTests/postsTestManager");
const usersTestManager_1 = require("../../../shared/__tests__/managersTests/usersTestManager");
const authTestManager_1 = require("../../../shared/__tests__/managersTests/authTestManager");
const blogsTestManager_1 = require("../../../shared/__tests__/managersTests/blogsTestManager");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
// import { container } from '../../src/shared/container/iocRoot';
// import { MongoDBCollection } from '../../src/db';
// const mongoDB: MongoDBCollection = container.get(MongoDBCollection)
const postsE2eTest = () => {
    describe('E2E-POSTS', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, postsTestManager_1.getRequest)().delete(`${settings_1.SETTINGS.RouterPath.__test__}/all-data`);
        }));
        it('Должен вернуть 200, массив постов - should return 200 and post array', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                login: contextTests_1.contextTests.correctUserName1,
                password: contextTests_1.contextTests.correctUserPassword1,
                email: contextTests_1.contextTests.correctUserEmail1
            };
            const { createdEntity } = yield usersTestManager_1.usersTestManager.createUser(userData, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdUser1 = createdEntity;
            const authData = {
                loginOrEmail: contextTests_1.contextTests.correctUserName1,
                password: contextTests_1.contextTests.correctUserPassword1
            };
            const { accessToken } = yield authTestManager_1.authTestManager.login(authData, contextTests_1.contextTests.userAgent[3], utils_1.HTTP_STATUSES.OK_200);
            contextTests_1.contextTests.accessTokenUser1Device1 = accessToken;
            const { getAllPosts } = yield postsTestManager_1.postsTestManager.getAllPosts(utils_1.HTTP_STATUSES.OK_200);
            expect(getAllPosts).toEqual(expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }));
        }));
        it('Должен возвращать 404 для несуществующего сообщения - should return 404 for a non-existent post', () => __awaiter(void 0, void 0, void 0, function* () {
            yield postsTestManager_1.postsTestManager.getPostsById(contextTests_1.contextTests.invalidId, utils_1.HTTP_STATUSES.NOT_FOUND_404);
        }));
        it(`Вы не должны создавать посты от неавторизованных пользователей! - You shouldn't create a post by an unauthorized user!`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                title: contextTests_1.contextTests.correctTitleBlog1Post1,
                shortDescription: contextTests_1.contextTests.shortDescriptionBlog1Post1,
                content: contextTests_1.contextTests.contentBlog1Post1,
                blogId: "1"
            };
            yield postsTestManager_1.postsTestManager.createPosts(data, contextTests_1.contextTests.expiredToken, utils_1.HTTP_STATUSES.UNAUTHORIZED_401);
            const { getAllPosts } = yield postsTestManager_1.postsTestManager.getAllPosts(utils_1.HTTP_STATUSES.OK_200);
            expect(getAllPosts).toEqual(expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }));
        }));
        it(`Не следует создавать пост с неверными исходными данными - You should not create a post with incorrect initial data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                title: '',
                shortDescription: '',
                content: '',
                blogId: ''
            };
            yield postsTestManager_1.postsTestManager.createPosts(data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            const { getAllPosts } = yield postsTestManager_1.postsTestManager.getAllPosts(utils_1.HTTP_STATUSES.OK_200);
            expect(getAllPosts).toEqual(expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }));
        }));
        it(`Необходимо создать пост с правильными исходными данными - it is necessary to create a post with the correct initial data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const blogData = {
                name: contextTests_1.contextTests.correctBlogNsme1,
                description: contextTests_1.contextTests.correctBlogDescription1,
                websiteUrl: contextTests_1.contextTests.correctWebsiteUrl1
            };
            const { bodyBlog } = yield blogsTestManager_1.blogsTestManager.createBlogs(blogData, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdBlog1 = bodyBlog;
            const data = {
                title: contextTests_1.contextTests.correctTitleBlog1Post1,
                shortDescription: contextTests_1.contextTests.shortDescriptionBlog1Post1,
                content: contextTests_1.contextTests.contentBlog1Post1,
                blogId: contextTests_1.contextTests.createdBlog1.id
            };
            const { createdEntity } = yield postsTestManager_1.postsTestManager.createPosts(data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdBlog1Post1 = createdEntity;
            const { getAllPosts } = yield postsTestManager_1.postsTestManager.getAllPosts(utils_1.HTTP_STATUSES.OK_200);
            expect(getAllPosts).toEqual(expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [contextTests_1.contextTests.createdBlog1Post1]
            }));
        }));
        it(`Создать еще один пост - create another post`, () => __awaiter(void 0, void 0, void 0, function* () {
            const blogData = {
                name: contextTests_1.contextTests.correctBlogNsme1,
                description: contextTests_1.contextTests.correctBlogDescription1,
                websiteUrl: contextTests_1.contextTests.correctWebsiteUrl1
            };
            const resData = yield blogsTestManager_1.blogsTestManager.createBlogs(blogData, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdBlog1 = resData.createdEntity;
            const data = {
                title: contextTests_1.contextTests.correctTitleBlog1Post2,
                shortDescription: contextTests_1.contextTests.shortDescriptionBlog1Post2,
                content: contextTests_1.contextTests.contentBlog1Post2,
                blogId: contextTests_1.contextTests.createdBlog1.id
            };
            const { createdEntity } = yield postsTestManager_1.postsTestManager.createPosts(data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdBlog1Post2 = createdEntity;
            const { getAllPosts } = yield postsTestManager_1.postsTestManager.getAllPosts(utils_1.HTTP_STATUSES.OK_200);
            expect(getAllPosts).toEqual(expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [contextTests_1.contextTests.createdBlog1Post2, contextTests_1.contextTests.createdBlog1Post1]
            }));
        }));
        it(`Не следует обновлять пост с неверными данными. - You should not update a post with incorrect post data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                title: '',
                shortDescription: '',
                content: '',
                blogId: ''
            };
            yield postsTestManager_1.postsTestManager.updatePosts(contextTests_1.contextTests.createdBlog1Post1.id, data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            const { getPostsById } = yield postsTestManager_1.postsTestManager.getPostsById(contextTests_1.contextTests.createdBlog1Post1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getPostsById).toEqual(expect.objectContaining(contextTests_1.contextTests.createdBlog1Post1));
        }));
        it(`Не следует обновлять несуществующий пост - You should not update a post that does not exist`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                title: contextTests_1.contextTests.correctTitleBlog1Post1,
                shortDescription: contextTests_1.contextTests.shortDescriptionBlog1Post1,
                content: contextTests_1.contextTests.contentBlog1Post1,
                blogId: contextTests_1.contextTests.invalidId
            };
            yield postsTestManager_1.postsTestManager.updatePosts(contextTests_1.contextTests.invalidId, data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.NOT_FOUND_404);
        }));
        it(`Необходимо обновить пост с правильными входными данными - should update post with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedPost = {
                title: contextTests_1.contextTests.correctTitleBlog1Post3,
                shortDescription: contextTests_1.contextTests.shortDescriptionBlog1Post3,
                content: contextTests_1.contextTests.contentBlog1Post3,
                blogId: contextTests_1.contextTests.createdBlog1Post1.blogId
            };
            yield postsTestManager_1.postsTestManager.updatePosts(contextTests_1.contextTests.createdBlog1Post1.id, updatedPost, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const { getPostsById } = yield postsTestManager_1.postsTestManager.getPostsById(contextTests_1.contextTests.createdBlog1Post1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getPostsById).toEqual(expect.objectContaining({
                title: updatedPost.title,
                shortDescription: updatedPost.shortDescription,
                content: updatedPost.content,
                blogId: updatedPost.blogId
            }));
            const { response } = yield postsTestManager_1.postsTestManager.getPostsById(contextTests_1.contextTests.createdBlog1Post2.id, utils_1.HTTP_STATUSES.OK_200);
            expect(response.body).toEqual(expect.objectContaining(contextTests_1.contextTests.createdBlog1Post2));
        }));
        it(`Следует удалить оба сообщения - should delete both posts`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield postsTestManager_1.postsTestManager.deletePost(contextTests_1.contextTests.createdBlog1Post1.id, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            yield postsTestManager_1.postsTestManager.getPostsById(contextTests_1.contextTests.createdBlog1Post1.id, utils_1.HTTP_STATUSES.NOT_FOUND_404);
            yield postsTestManager_1.postsTestManager.deletePost(contextTests_1.contextTests.createdBlog1Post2.id, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            yield postsTestManager_1.postsTestManager.getPostsById(contextTests_1.contextTests.createdBlog1Post2.id, utils_1.HTTP_STATUSES.NOT_FOUND_404);
            const { getAllPosts } = yield postsTestManager_1.postsTestManager.getAllPosts(utils_1.HTTP_STATUSES.OK_200);
            expect(getAllPosts).toEqual(expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }));
        }));
        afterAll(done => {
            done();
        });
    });
};
exports.postsE2eTest = postsE2eTest;
