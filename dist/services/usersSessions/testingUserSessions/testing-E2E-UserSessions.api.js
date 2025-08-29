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
exports.usersSessionsE2eTest = exports.delay = void 0;
const settings_1 = require("../../../shared/settings");
const utils_1 = require("../../../shared/utils/utils");
const testing_INTEGRATION_UsersSessions_api_1 = require("./testing-INTEGRATION-UsersSessions.api");
const usersTestManager_1 = require("../../../shared/__tests__/managersTests/usersTestManager");
const authTestManager_1 = require("../../../shared/__tests__/managersTests/authTestManager");
const compositionRootCustom_1 = require("../../../shared/container/compositionRootCustom");
const userSessionTestManager_1 = require("../../../shared/__tests__/managersTests/userSessionTestManager");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
const delay = (milliseconds) => new Promise((resolve) => {
    return setTimeout(() => resolve(true), milliseconds);
});
exports.delay = delay;
const usersSessionsE2eTest = () => {
    describe('E2E-USERS-SESSIONS', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, testing_INTEGRATION_UsersSessions_api_1.getRequest)().delete(`${settings_1.SETTINGS.RouterPath.__test__}/all-data`);
            const userData1 = {
                login: contextTests_1.contextTests.correctUserName1,
                password: contextTests_1.contextTests.correctUserPassword1,
                email: contextTests_1.contextTests.correctUserEmail1
            };
            const { response } = yield usersTestManager_1.usersTestManager.createUser(userData1, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdUser1 = response;
            const userData2 = {
                login: contextTests_1.contextTests.correctUserName2,
                password: contextTests_1.contextTests.correctUserPassword2,
                email: contextTests_1.contextTests.correctUserEmail2
            };
            const { createdEntity } = yield usersTestManager_1.usersTestManager.createUser(userData2, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdUser2 = createdEntity;
        }));
        it('Должен создать жменю сессий пользователя', () => __awaiter(void 0, void 0, void 0, function* () {
            const countSession = 4;
            for (let i = 0; i < countSession; i++) {
                yield (0, exports.delay)(1000);
                const { accessToken, refreshToken } = yield authTestManager_1.authTestManager.login({
                    loginOrEmail: contextTests_1.contextTests.correctUserName1,
                    password: contextTests_1.contextTests.correctUserPassword1
                }, contextTests_1.contextTests.userAgent[i], utils_1.HTTP_STATUSES.OK_200);
                if (i === 0) {
                    contextTests_1.contextTests.accessTokenUser1Device1 = accessToken,
                        contextTests_1.contextTests.refreshTokenUser1Device1 = refreshToken;
                    const userToken = yield compositionRootCustom_1.tokenService.validateRefreshToken(contextTests_1.contextTests.refreshTokenUser1Device1);
                    const foundDevice = yield compositionRootCustom_1.securityDeviceServices._getSessionByDeviceIdServices(String(userToken.deviceId));
                    contextTests_1.contextTests.session1User1 = foundDevice;
                }
                else if (i === 1) {
                    contextTests_1.contextTests.accessTokenUser1Device2 = accessToken,
                        contextTests_1.contextTests.refreshTokenUser1Device2 = refreshToken;
                    const userToken = yield compositionRootCustom_1.tokenService.validateRefreshToken(contextTests_1.contextTests.refreshTokenUser1Device2);
                    const foundDevice = yield compositionRootCustom_1.securityDeviceServices._getSessionByDeviceIdServices(String(userToken.deviceId));
                    contextTests_1.contextTests.session2User1 = foundDevice;
                }
                else if (i === 2) {
                    contextTests_1.contextTests.accessTokenUser1Device3 = accessToken,
                        contextTests_1.contextTests.refreshTokenUser1Device3 = refreshToken;
                    const userToken = yield compositionRootCustom_1.tokenService.validateRefreshToken(contextTests_1.contextTests.refreshTokenUser1Device3);
                    const foundDevice = yield compositionRootCustom_1.securityDeviceServices._getSessionByDeviceIdServices(String(userToken.deviceId));
                    contextTests_1.contextTests.session3User1 = foundDevice;
                }
                else if (i === 3) {
                    contextTests_1.contextTests.accessTokenUser1Device4 = accessToken,
                        contextTests_1.contextTests.refreshTokenUser1Device4 = refreshToken;
                    const userToken = yield compositionRootCustom_1.tokenService.validateRefreshToken(contextTests_1.contextTests.refreshTokenUser1Device4);
                    const foundDevice = yield compositionRootCustom_1.securityDeviceServices._getSessionByDeviceIdServices(String(userToken.deviceId));
                    contextTests_1.contextTests.session4User1 = foundDevice;
                }
            }
            const { arrSessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(arrSessions.length).toBe(countSession);
        }));
        it('Должен возвращать 403 при удалении чужой сессии пользователя!', () => __awaiter(void 0, void 0, void 0, function* () {
            const { refreshToken } = yield authTestManager_1.authTestManager.login({
                loginOrEmail: contextTests_1.contextTests.correctUserName2,
                password: contextTests_1.contextTests.correctUserPassword2
            }, contextTests_1.contextTests.userAgent[0], utils_1.HTTP_STATUSES.OK_200);
            yield userSessionTestManager_1.usersSessionTestManager.deleteSessionByDeviceId(contextTests_1.contextTests.session4User1.deviceId, refreshToken, utils_1.HTTP_STATUSES.FORBIDDEN_403);
        }));
        it('Должен возвращать 200, выдавать новую пару access и refresh tokens при посещении refresh-token, а так же заносить старый refreshToken в черный список!', () => __awaiter(void 0, void 0, void 0, function* () {
            const { arrSessions: userSessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(userSessions.length).toBe(4);
            const { response, refresh } = yield authTestManager_1.authTestManager.refreshToken(contextTests_1.contextTests.accessTokenUser1Device1, contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            contextTests_1.contextTests.accessTokenUser1Device1 = response.body.accessToken;
            contextTests_1.contextTests.refreshTokenUser1Device1 = refresh;
            expect(contextTests_1.contextTests.accessTokenUser1Device1).toBeDefined();
            expect(typeof contextTests_1.contextTests.accessTokenUser1Device1).toBe('string');
            expect(contextTests_1.contextTests.refreshTokenUser1Device1).toBeDefined();
            expect(typeof contextTests_1.contextTests.refreshTokenUser1Device1).toBe('string');
            const { arrSessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(arrSessions.length).toBe(4);
        }));
        it('Должен возвращать 204 при успешном удалении сессии пользователя!', () => __awaiter(void 0, void 0, void 0, function* () {
            const { arrSessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(arrSessions.length).toBe(4);
            yield userSessionTestManager_1.usersSessionTestManager.deleteSessionByDeviceId(contextTests_1.contextTests.session2User1.deviceId, contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const { response } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(response.length).toBe(3);
        }));
        it('Должен возвращать при logout 204 и заносить в черный список refreshToken!', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, exports.delay)(2000);
            yield authTestManager_1.authTestManager.logout(contextTests_1.contextTests.accessTokenUser1Device3, contextTests_1.contextTests.refreshTokenUser1Device3, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const { response } = yield authTestManager_1.authTestManager.refreshToken(contextTests_1.contextTests.accessTokenUser1Device3, contextTests_1.contextTests.refreshTokenUser1Device3, utils_1.HTTP_STATUSES.UNAUTHORIZED_401);
            expect(response.body[0].message).toBe('Онулирован refresh-token!');
            const { response: sessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(sessions.length).toBe(2);
        }));
        it(`Должен удалить все сессии пользователя!`, () => __awaiter(void 0, void 0, void 0, function* () {
            yield userSessionTestManager_1.usersSessionTestManager.deleteUserSessions(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const { arrSessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(arrSessions.length).toBe(1);
        }));
        it.skip('Должен обновлять жизнь сессии при любых запросах на индпоинты!', () => __awaiter(void 0, void 0, void 0, function* () {
            const { arrSessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            // console.log('TEST - getAllUserSession', getAllUserSession)
        }));
        // it(`Не стоит обновлять несуществующего пользователя - You should not update a user that does not exist`, async () => {
        //     const data = {
        //         login: 'no-user-login',
        //         password: 'no-user-password',
        //         email: 'no-user-email'
        //     }
        //     await usersTestManager.updateUser('66b9413d36f75d0b44ad1c5a', data, 
        //         // authToken1,
        //         codedAuth, 
        //         HTTP_STATUSES.NOT_FOUND_404)
        // })
        // it(`Необходимо обновить пользователя с правильными исходными данными - should update user with correct input data`, async () => {
        //     const data: any = {
        //         login: 'loginUPD',
        //         password: 'update_password',
        //         email: 'update_mail@mail.ru'
        //     }
        //     await usersTestManager.updateUser(createdUser1.id, data, 
        //         // authToken1,
        //         codedAuth, 
        //         HTTP_STATUSES.NO_CONTENT_204)
        //     const {getUsersById} = await usersTestManager.getUserById(createdUser1.id, HTTP_STATUSES.OK_200)
        //     expect(getUsersById).toEqual(
        //         expect.objectContaining({
        //             login: data.login,
        //             email: data.email
        //         }))
        //     const {response} = await usersTestManager.getUserById(createdUser2.id, HTTP_STATUSES.OK_200)
        //     expect(response.body)
        //         .toEqual(expect.objectContaining(createdUser2))
        // })
        afterAll(done => {
            done();
        });
    });
};
exports.usersSessionsE2eTest = usersSessionsE2eTest;
