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
exports.usersE2eTest = void 0;
const settings_1 = require("../../../shared/settings");
const utils_1 = require("../../../shared/utils/utils");
const authTestManager_1 = require("../../../shared/__tests__/managersTests/authTestManager");
const usersTestManager_1 = require("../../../shared/__tests__/managersTests/usersTestManager");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
// import { container } from "../../src/shared/container/iocRoot";
// import { MongoDBCollection } from '../../src/db';
// const mongoDB: MongoDBCollection = container.get(MongoDBCollection)
// const tokenService: TokenService = container.get(TokenService)
const usersE2eTest = () => {
    describe('E2E-USERS', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, authTestManager_1.getRequest)().delete(`${settings_1.SETTINGS.RouterPath.__test__}/all-data`);
        }));
        it('Должен возвращать 200, а массив постов - should return 200 and user array', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getAllUsers } = yield usersTestManager_1.usersTestManager.getAllUsers(contextTests_1.contextTests.userParams, utils_1.HTTP_STATUSES.OK_200);
            expect(getAllUsers).toEqual(expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }));
        }));
        it('Должен возвращать 404 для несуществующего пользователя - should return 404 for a non-existent user', () => __awaiter(void 0, void 0, void 0, function* () {
            yield usersTestManager_1.usersTestManager.getUserById(contextTests_1.contextTests.invalidId, utils_1.HTTP_STATUSES.NOT_FOUND_404);
        }));
        it(`Не стоит создавать пользователя с не валидными исходными данными - You should not create a user with incorrect initial data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                login: '',
                password: '',
                email: ''
            };
            yield usersTestManager_1.usersTestManager.createUser(data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            const { getAllUsers } = yield usersTestManager_1.usersTestManager.getAllUsers(contextTests_1.contextTests.userParams, utils_1.HTTP_STATUSES.OK_200);
            expect(getAllUsers).toEqual(expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }));
        }));
        it(`Необходимо создать пользователя с правильными исходными данными - it is necessary to create a user with the correct initial data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                login: contextTests_1.contextTests.correctUserName1,
                password: contextTests_1.contextTests.correctUserPassword1,
                email: contextTests_1.contextTests.correctUserEmail1
            };
            const { createdEntity } = yield usersTestManager_1.usersTestManager.createUser(data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdUser1 = createdEntity;
            const authData = {
                loginOrEmail: data.email,
                password: data.password
            };
            const { accessToken, refreshToken } = yield authTestManager_1.authTestManager.login(authData, contextTests_1.contextTests.userAgent[4], utils_1.HTTP_STATUSES.OK_200);
            contextTests_1.contextTests.accessTokenUser1Device1 = accessToken;
            contextTests_1.contextTests.refreshTokenUser1Device1 = refreshToken;
            const { getAllUsers } = yield usersTestManager_1.usersTestManager.getAllUsers(contextTests_1.contextTests.userParams, utils_1.HTTP_STATUSES.OK_200);
            expect(getAllUsers).toEqual(expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [contextTests_1.contextTests.createdUser1]
            }));
        }));
        it(`Создать еще одного пользователя - create another user`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                login: contextTests_1.contextTests.correctUserName2,
                password: contextTests_1.contextTests.correctUserPassword2,
                email: contextTests_1.contextTests.correctUserEmail2
            };
            const { createdEntity } = yield usersTestManager_1.usersTestManager.createUser(data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdUser2 = createdEntity;
            const authData = {
                loginOrEmail: data.email,
                password: data.password
            };
            const { accessToken } = yield authTestManager_1.authTestManager.login(authData, contextTests_1.contextTests.userAgent[6], utils_1.HTTP_STATUSES.OK_200);
            contextTests_1.contextTests.accessTokenUser2Device1 = accessToken;
            const { getAllUsers } = yield usersTestManager_1.usersTestManager.getAllUsers(contextTests_1.contextTests.userParams, utils_1.HTTP_STATUSES.OK_200);
            expect(getAllUsers).toEqual(expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [contextTests_1.contextTests.createdUser1, contextTests_1.contextTests.createdUser2]
            }));
        }));
        it(`Не следует обновлять пользователя с невалидными данными - You should not update a user with incorrect user data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                login: '',
                password: '',
                email: ''
            };
            yield usersTestManager_1.usersTestManager.updateUser(contextTests_1.contextTests.createdUser1.id, data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.BAD_REQUEST_400);
            const { getUsersById } = yield usersTestManager_1.usersTestManager.getUserById(contextTests_1.contextTests.createdUser1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getUsersById).toEqual(expect.objectContaining(contextTests_1.contextTests.createdUser1));
        }));
        it(`Не стоит обновлять несуществующего пользователя - You should not update a user that does not exist`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                login: contextTests_1.contextTests.correctUserName3,
                password: contextTests_1.contextTests.correctUserPassword3,
                email: contextTests_1.contextTests.correctUserEmail3
            };
            yield usersTestManager_1.usersTestManager.updateUser(contextTests_1.contextTests.invalidId, data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.NOT_FOUND_404);
        }));
        it(`Необходимо обновить пользователя с правильными исходными данными - should update user with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
            const data = {
                login: contextTests_1.contextTests.correctUserName2,
                password: contextTests_1.contextTests.correctUserPassword2,
                email: contextTests_1.contextTests.correctUserEmail2
            };
            yield usersTestManager_1.usersTestManager.updateUser(contextTests_1.contextTests.createdUser1.id, data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const { getUsersById } = yield usersTestManager_1.usersTestManager.getUserById(contextTests_1.contextTests.createdUser1.id, utils_1.HTTP_STATUSES.OK_200);
            expect(getUsersById).toEqual(expect.objectContaining({
                login: data.login,
                email: data.email
            }));
            const { response } = yield usersTestManager_1.usersTestManager.getUserById(contextTests_1.contextTests.createdUser2.id, utils_1.HTTP_STATUSES.OK_200);
            expect(response.body)
                .toEqual(expect.objectContaining(contextTests_1.contextTests.createdUser2));
        }));
        it(`Должен удалить оба пользователя - should delete both user`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield usersTestManager_1.usersTestManager.deleteUser(contextTests_1.contextTests.createdUser1.id, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            yield usersTestManager_1.usersTestManager.getUserById(contextTests_1.contextTests.createdUser1.id, utils_1.HTTP_STATUSES.NOT_FOUND_404);
            yield usersTestManager_1.usersTestManager.deleteUser(contextTests_1.contextTests.createdUser2.id, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            yield usersTestManager_1.usersTestManager.getUserById(contextTests_1.contextTests.createdUser2.id, utils_1.HTTP_STATUSES.NOT_FOUND_404);
            const { getAllUsers } = yield usersTestManager_1.usersTestManager.getAllUsers(contextTests_1.contextTests.userParams, utils_1.HTTP_STATUSES.OK_200);
            expect(getAllUsers).toEqual(expect.objectContaining({
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
exports.usersE2eTest = usersE2eTest;
