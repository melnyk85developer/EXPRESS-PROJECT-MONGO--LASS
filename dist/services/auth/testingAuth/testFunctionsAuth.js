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
exports.isLoginUser3 = exports.isLoginUser2 = exports.isLoginUser1 = void 0;
const contextTests_1 = require("../../../shared/__tests__/contextTests");
const authTestManager_1 = require("../../../shared/__tests__/managersTests/authTestManager");
const usersTestManager_1 = require("../../../shared/__tests__/managersTests/usersTestManager");
const utils_1 = require("../../../shared/utils/utils");
const isLoginUser1 = (access_1, refresh_1, email_1, password_1, userAgent_1, ...args_1) => __awaiter(void 0, [access_1, refresh_1, email_1, password_1, userAgent_1, ...args_1], void 0, function* (access, refresh, email, password, userAgent, statusCode = utils_1.HTTP_STATUSES.CREATED_201) {
    if (!contextTests_1.contextTests.accessTokenUser1Device1) {
        const { accessToken, refreshToken, response } = yield authTestManager_1.authTestManager.login({
            loginOrEmail: email,
            password: password
        }, userAgent, statusCode);
        if (response.status === statusCode) {
            contextTests_1.contextTests.accessTokenUser1Device1 = accessToken;
            expect(accessToken).toBeDefined();
            expect(typeof accessToken).toBe('string');
            contextTests_1.contextTests.refreshTokenUser1Device1 = refreshToken;
            expect(refreshToken).toBeDefined();
            expect(typeof refreshToken).toBe('string');
            const { userInfo } = yield authTestManager_1.authTestManager.getUserInfo(contextTests_1.contextTests.accessTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            const { getUsersById } = yield usersTestManager_1.usersTestManager.getUserById(userInfo.userId, utils_1.HTTP_STATUSES.OK_200);
            contextTests_1.contextTests.createdUser1 = getUsersById;
            contextTests_1.contextTests.total_number_of_active_sessions_in_tests++;
            return { authData: { accessToken, refreshToken }, response };
        }
        else {
            return response.body;
        }
    }
});
exports.isLoginUser1 = isLoginUser1;
const isLoginUser2 = (access_1, refresh_1, email_1, password_1, userAgent_1, ...args_1) => __awaiter(void 0, [access_1, refresh_1, email_1, password_1, userAgent_1, ...args_1], void 0, function* (access, refresh, email, password, userAgent, statusCode = utils_1.HTTP_STATUSES.CREATED_201) {
    if (!contextTests_1.contextTests.accessTokenUser2Device1) {
        const { accessToken, refreshToken, response } = yield authTestManager_1.authTestManager.login({
            loginOrEmail: email,
            password: password
        }, userAgent, statusCode);
        console.log('TEST isLoginUser1: - authData', contextTests_1.contextTests.accessTokenUser2Device1, contextTests_1.contextTests.refreshTokenUser2Device1);
        if (response.status === statusCode) {
            contextTests_1.contextTests.accessTokenUser2Device1 = accessToken;
            expect(accessToken).toBeDefined();
            expect(typeof accessToken).toBe('string');
            contextTests_1.contextTests.refreshTokenUser2Device1 = refreshToken;
            expect(refreshToken).toBeDefined();
            expect(typeof refreshToken).toBe('string');
            const { userInfo } = yield authTestManager_1.authTestManager.getUserInfo(contextTests_1.contextTests.accessTokenUser2Device1, utils_1.HTTP_STATUSES.OK_200);
            const { getUsersById } = yield usersTestManager_1.usersTestManager.getUserById(userInfo.userId, utils_1.HTTP_STATUSES.OK_200);
            contextTests_1.contextTests.createdUser2 = getUsersById;
            contextTests_1.contextTests.total_number_of_active_sessions_in_tests++;
            return { authData: { accessToken, refreshToken }, response };
        }
        else {
            return response.body;
        }
    }
});
exports.isLoginUser2 = isLoginUser2;
const isLoginUser3 = (access_1, refresh_1, email_1, password_1, userAgent_1, ...args_1) => __awaiter(void 0, [access_1, refresh_1, email_1, password_1, userAgent_1, ...args_1], void 0, function* (access, refresh, email, password, userAgent, statusCode = utils_1.HTTP_STATUSES.CREATED_201) {
    if (!contextTests_1.contextTests.accessTokenUser3Device1) {
        const { accessToken, refreshToken, response } = yield authTestManager_1.authTestManager.login({
            loginOrEmail: email,
            password: password
        }, userAgent, statusCode);
        console.log('TEST isLoginUser1: - authData', contextTests_1.contextTests.accessTokenUser3Device1, contextTests_1.contextTests.refreshTokenUser3Device1);
        if (response.status === statusCode) {
            contextTests_1.contextTests.accessTokenUser3Device1 = accessToken;
            expect(accessToken).toBeDefined();
            expect(typeof accessToken).toBe('string');
            contextTests_1.contextTests.refreshTokenUser3Device1 = refreshToken;
            expect(refreshToken).toBeDefined();
            expect(typeof refreshToken).toBe('string');
            const { userInfo } = yield authTestManager_1.authTestManager.getUserInfo(contextTests_1.contextTests.accessTokenUser3Device1, utils_1.HTTP_STATUSES.OK_200);
            const { getUsersById } = yield usersTestManager_1.usersTestManager.getUserById(userInfo.userId, utils_1.HTTP_STATUSES.OK_200);
            contextTests_1.contextTests.createdUser3 = getUsersById;
            contextTests_1.contextTests.total_number_of_active_sessions_in_tests++;
            return { authData: { accessToken, refreshToken }, response };
        }
        else {
            return response.body;
        }
    }
});
exports.isLoginUser3 = isLoginUser3;
