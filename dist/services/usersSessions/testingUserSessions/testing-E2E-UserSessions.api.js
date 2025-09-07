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
exports.usersSessionsE2eTest = void 0;
const utils_1 = require("../../../shared/utils/utils");
const authTestManager_1 = require("../../../shared/__tests__/managersTests/authTestManager");
const userSessionTestManager_1 = require("../../../shared/__tests__/managersTests/userSessionTestManager");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
const all_test_1 = require("../../../shared/__tests__/all.test");
const testFunctionsUser_1 = require("../../users/testingUsers/testFunctionsUser");
const usersSessionsE2eTest = () => {
    describe('E2E-USERS-SESSIONS', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const isUser1 = yield (0, testFunctionsUser_1.isCreatedUser1)(contextTests_1.contextTests.correctUserName1, contextTests_1.contextTests.correctUserEmail1, contextTests_1.contextTests.correctUserPassword1, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            // console.log('TEST: - isUser1 blogsE2eTest', isUser1)
            const isUser2 = yield (0, testFunctionsUser_1.isCreatedUser2)(contextTests_1.contextTests.correctUserName2, contextTests_1.contextTests.correctUserEmail2, contextTests_1.contextTests.correctUserPassword2, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            // console.log('TEST: - isUser2 usersSessionsE2eTest', isUser2)
        }));
        it('Должен создать жменю сессий пользователя', () => __awaiter(void 0, void 0, void 0, function* () {
            const countSession = 4;
            for (let i = 0; i < countSession; i++) {
                yield (0, all_test_1.delay)(1000);
                const { accessToken, refreshToken } = yield authTestManager_1.authTestManager.login({
                    loginOrEmail: contextTests_1.contextTests.correctUserName1,
                    password: contextTests_1.contextTests.correctUserPassword1
                }, contextTests_1.contextTests.userAgent[i], utils_1.HTTP_STATUSES.OK_200);
                if (i === 0) {
                    contextTests_1.contextTests.accessTokenUser1Device1 = accessToken,
                        contextTests_1.contextTests.refreshTokenUser1Device1 = refreshToken;
                    const userToken = yield contextTests_1.contextTests.tokenService.validateRefreshToken(contextTests_1.contextTests.refreshTokenUser1Device1);
                    const foundDevice = yield contextTests_1.contextTests.usersSessionService._getSessionByDeviceIdServices(String(userToken.deviceId));
                    contextTests_1.contextTests.session1User1 = foundDevice;
                }
                else if (i === 1) {
                    contextTests_1.contextTests.accessTokenUser1Device2 = accessToken,
                        contextTests_1.contextTests.refreshTokenUser1Device2 = refreshToken;
                    const userToken = yield contextTests_1.contextTests.tokenService.validateRefreshToken(contextTests_1.contextTests.refreshTokenUser1Device2);
                    const foundDevice = yield contextTests_1.contextTests.usersSessionService._getSessionByDeviceIdServices(String(userToken.deviceId));
                    contextTests_1.contextTests.session2User1 = foundDevice;
                }
                else if (i === 2) {
                    contextTests_1.contextTests.accessTokenUser1Device3 = accessToken,
                        contextTests_1.contextTests.refreshTokenUser1Device3 = refreshToken;
                    const userToken = yield contextTests_1.contextTests.tokenService.validateRefreshToken(contextTests_1.contextTests.refreshTokenUser1Device3);
                    const foundDevice = yield contextTests_1.contextTests.usersSessionService._getSessionByDeviceIdServices(String(userToken.deviceId));
                    contextTests_1.contextTests.session3User1 = foundDevice;
                }
                else if (i === 3) {
                    contextTests_1.contextTests.accessTokenUser1Device4 = accessToken,
                        contextTests_1.contextTests.refreshTokenUser1Device4 = refreshToken;
                    const userToken = yield contextTests_1.contextTests.tokenService.validateRefreshToken(contextTests_1.contextTests.refreshTokenUser1Device4);
                    const foundDevice = yield contextTests_1.contextTests.usersSessionService._getSessionByDeviceIdServices(String(userToken.deviceId));
                    contextTests_1.contextTests.session4User1 = foundDevice;
                }
                contextTests_1.contextTests.total_number_of_active_sessions_in_tests = i;
            }
            const { arrSessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(arrSessions.length).toBe(contextTests_1.contextTests.total_number_of_active_sessions_in_tests);
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
            yield (0, all_test_1.delay)(2000);
            yield authTestManager_1.authTestManager.logout(contextTests_1.contextTests.accessTokenUser1Device3, contextTests_1.contextTests.refreshTokenUser1Device3, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const { response } = yield authTestManager_1.authTestManager.refreshToken(contextTests_1.contextTests.accessTokenUser1Device3, contextTests_1.contextTests.refreshTokenUser1Device3, utils_1.HTTP_STATUSES.UNAUTHORIZED_401);
            expect(response.body[0].message).toBe('Онулирован refresh-token!');
            const { response: sessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(sessions.length).toBe(2);
            if (response.status === utils_1.HTTP_STATUSES.NO_CONTENT_204) {
                contextTests_1.contextTests.accessTokenUser1Device3 = null,
                    contextTests_1.contextTests.refreshTokenUser1Device3 = null;
            }
        }));
        it(`Должен удалить все сессии пользователя!`, () => __awaiter(void 0, void 0, void 0, function* () {
            const { response } = yield userSessionTestManager_1.usersSessionTestManager.deleteUserSessions(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const { arrSessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(arrSessions.length).toBe(1);
            if (response.status === utils_1.HTTP_STATUSES.NO_CONTENT_204) {
                contextTests_1.contextTests.accessTokenUser2Device1 === null;
                contextTests_1.contextTests.refreshTokenUser2Device1 === null;
                contextTests_1.contextTests.total_number_of_active_sessions_in_tests = 1;
            }
        }));
        it.skip('Должен обновлять жизнь сессии при любых запросах на индпоинты!', () => __awaiter(void 0, void 0, void 0, function* () {
            const { arrSessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            // console.log('TEST - getAllUserSession', getAllUserSession)
        }));
    });
};
exports.usersSessionsE2eTest = usersSessionsE2eTest;
