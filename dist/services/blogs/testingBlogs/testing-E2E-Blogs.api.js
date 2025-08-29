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
exports.blogsE2eTest = void 0;
require("reflect-metadata");
// import { container } from '../../src/shared/container/iocRoot';
const utils_1 = require("../../../shared/utils/utils");
const settings_1 = require("../../../shared/settings");
const usersTestManager_1 = require("../../../shared/__tests__/managersTests/usersTestManager");
const authTestManager_1 = require("../../../shared/__tests__/managersTests/authTestManager");
const blogsTestManager_1 = require("../../../shared/__tests__/managersTests/blogsTestManager");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
// import { MongoDBCollection } from '../../src/db';
// const mongoDB: MongoDBCollection = container.resolve(MongoDBCollection)
// const mongoDB: MongoDBCollection = container.get(MongoDBCollection)
const blogsE2eTest = () => {
    describe('E2E-BLOGS', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, blogsTestManager_1.getRequest)().delete(`${settings_1.SETTINGS.RouterPath.__test__}/all-data`);
        }));
        it('Должен возвращать 200, а массив блогов - should return 200 and blog array', () => __awaiter(void 0, void 0, void 0, function* () {
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
            const { accessToken } = yield authTestManager_1.authTestManager.login(authData, contextTests_1.contextTests.userAgent[1], utils_1.HTTP_STATUSES.OK_200);
            contextTests_1.contextTests.accessTokenUser1Device1 = accessToken;
            const { getBlogs } = yield blogsTestManager_1.blogsTestManager.getAllBlogs(utils_1.HTTP_STATUSES.OK_200);
            expect(getBlogs).toEqual(expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }));
        }));
        it('Должен возвращать 404 для несуществующего блога - should return 404 for a non-existent blog', () => __awaiter(void 0, void 0, void 0, function* () {
            yield blogsTestManager_1.blogsTestManager.getBlogsById(contextTests_1.contextTests.invalidId, utils_1.HTTP_STATUSES.NOT_FOUND_404);
        }));
        it(`Вы не должны создавать блог от неавторизованных пользователей! - You shouldn't create a post by an unauthorized user!`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                name: contextTests_1.contextTests.correctBlogNsme1,
                description: contextTests_1.contextTests.correctBlogDescription1,
                websiteUrl: contextTests_1.contextTests.correctWebsiteUrl1
            };
            yield blogsTestManager_1.blogsTestManager.createBlogs(data, contextTests_1.contextTests.expiredToken, utils_1.HTTP_STATUSES.UNAUTHORIZED_401);
            yield (0, blogsTestManager_1.getRequest)()
                .get(settings_1.SETTINGS.RouterPath.blogs)
                .expect(utils_1.HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            });
        }));
        it(`Не стоит создавать блог с неверными исходными данными - You should not create a blog with incorrect initial data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                name: '',
                description: '',
                websiteUrl: ''
            };
            yield blogsTestManager_1.blogsTestManager.createBlogs(data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            yield (0, blogsTestManager_1.getRequest)()
                .get(settings_1.SETTINGS.RouterPath.blogs)
                .expect(utils_1.HTTP_STATUSES.OK_200, {
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            });
        }));
        it(`Необходимо создать блог с правильными исходными данными - it is necessary to create a blog with the correct initial data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                name: contextTests_1.contextTests.correctBlogNsme1,
                description: contextTests_1.contextTests.correctBlogDescription1,
                websiteUrl: contextTests_1.contextTests.correctWebsiteUrl1
            };
            const { createdEntity } = yield blogsTestManager_1.blogsTestManager.createBlogs(data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdBlog1 = createdEntity;
            const { getBlogs } = yield blogsTestManager_1.blogsTestManager.getAllBlogs(utils_1.HTTP_STATUSES.OK_200);
            expect(getBlogs).toEqual(expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [contextTests_1.contextTests.createdBlog1]
            }));
        }));
        it(`Создать еще один блог - create another blog`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                name: contextTests_1.contextTests.correctBlogNsme2,
                description: contextTests_1.contextTests.correctBlogDescription2,
                websiteUrl: contextTests_1.contextTests.correctWebsiteUrl2
            };
            const { createdEntity } = yield blogsTestManager_1.blogsTestManager.createBlogs(data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdBlog2 = createdEntity;
            const { getBlogs } = yield blogsTestManager_1.blogsTestManager.getAllBlogs(utils_1.HTTP_STATUSES.OK_200);
            expect(getBlogs).toEqual(expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [contextTests_1.contextTests.createdBlog2, contextTests_1.contextTests.createdBlog1]
            }));
        }));
        it(`Не следует обновлять блог с неверными данными о нем - You should not update a blog with incorrect blog data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                name: '',
                description: '',
                websiteUrl: ''
            };
            yield blogsTestManager_1.blogsTestManager.updateBlogs(data, contextTests_1.contextTests.codedAuth, contextTests_1.contextTests.createdBlog1.id, utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            const { getBlog } = yield blogsTestManager_1.blogsTestManager.getBlogsById(contextTests_1.contextTests.createdBlog1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getBlog).toEqual(expect.objectContaining(contextTests_1.contextTests.createdBlog1));
        }));
        it(`Не стоит обновлять несуществующий блог - You should not update a blog that does not exist`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                name: contextTests_1.contextTests.correctBlogNsme3,
                description: contextTests_1.contextTests.correctBlogDescription3,
                websiteUrl: contextTests_1.contextTests.correctWebsiteUrl3
            };
            yield blogsTestManager_1.blogsTestManager.updateBlogs(data, contextTests_1.contextTests.codedAuth, contextTests_1.contextTests.invalidId, utils_1.HTTP_STATUSES.NOT_FOUND_404);
        }));
        it(`Необходимо обновить блог с правильными исходными данными - should update blog with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                name: contextTests_1.contextTests.correctBlogNsme4,
                description: contextTests_1.contextTests.correctBlogDescription4,
                websiteUrl: contextTests_1.contextTests.correctWebsiteUrl4
            };
            yield blogsTestManager_1.blogsTestManager.updateBlogs(data, contextTests_1.contextTests.codedAuth, contextTests_1.contextTests.createdBlog1.id, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const { getBlog } = yield blogsTestManager_1.blogsTestManager.getBlogsById(contextTests_1.contextTests.createdBlog1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getBlog).toEqual(expect.objectContaining({
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            }));
            const { response } = yield blogsTestManager_1.blogsTestManager.getBlogsById(contextTests_1.contextTests.createdBlog2.id, utils_1.HTTP_STATUSES.OK_200);
            expect(response.body).toEqual(expect.objectContaining(contextTests_1.contextTests.createdBlog2));
        }));
        it(`Должен удалить оба блога - should delete both blog`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield blogsTestManager_1.blogsTestManager.deleteBlogs(contextTests_1.contextTests.createdBlog1.id, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            yield blogsTestManager_1.blogsTestManager.getBlogsById(contextTests_1.contextTests.createdBlog1.id, utils_1.HTTP_STATUSES.NOT_FOUND_404);
            yield blogsTestManager_1.blogsTestManager.deleteBlogs(contextTests_1.contextTests.createdBlog2.id, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            yield blogsTestManager_1.blogsTestManager.getBlogsById(contextTests_1.contextTests.createdBlog2.id, utils_1.HTTP_STATUSES.NOT_FOUND_404);
            const { getBlogs } = yield blogsTestManager_1.blogsTestManager.getAllBlogs(utils_1.HTTP_STATUSES.OK_200);
            expect(getBlogs).toEqual(expect.objectContaining({
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
exports.blogsE2eTest = blogsE2eTest;
