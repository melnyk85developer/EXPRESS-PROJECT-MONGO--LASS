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
exports.authE2eTest = void 0;
const utils_1 = require("../../../shared/utils/utils");
const authTestManager_1 = require("../../../shared/__tests__/managersTests/authTestManager");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
const authServices_1 = require("../authServices");
const iocRoot_1 = require("../../../shared/container/iocRoot");
const emailAdapter_1 = require("../../../shared/infrastructure/emailAdapter");
const testing_E2E_UserSessions_api_1 = require("../../usersSessions/testingUserSessions/testing-E2E-UserSessions.api");
const authServices = iocRoot_1.container.get(authServices_1.AuthServices);
const mailService = iocRoot_1.container.get(emailAdapter_1.MailService);
const authE2eTest = () => {
    describe('E2E-AUTH', () => {
        it('Должен возвращать 204 при успешной регистрации!', () => __awaiter(void 0, void 0, void 0, function* () {
            const login = contextTests_1.contextTests.correctUserName1;
            const email = contextTests_1.contextTests.correctUserEmail1;
            const password = contextTests_1.contextTests.correctUserPassword1;
            mailService.sendMail = jest.fn((from, to, subject, text, html) => {
                return Promise.resolve(true);
            });
            const response = yield authServices.registrationServices(login, password, email);
            expect(response).toHaveProperty('insertedId');
            expect(mailService.sendMail).toHaveBeenCalledWith(expect.any(String), email, expect.stringContaining('Активация аккаунта'), expect.any(String), expect.stringContaining('href="http://localhost:5006/auth/confirm-email'));
            expect(response).not.toBeNull();
        }));
        it('Должен возвращать 200 при успешной авторизации!', () => __awaiter(void 0, void 0, void 0, function* () {
            const userData = {
                login: contextTests_1.contextTests.correctUserName1,
                password: contextTests_1.contextTests.correctUserPassword1,
                email: contextTests_1.contextTests.correctUserEmail1,
            };
            const authData = {
                loginOrEmail: userData.login,
                password: userData.password
            };
            const { accessToken, refreshToken } = yield authTestManager_1.authTestManager.login(authData, contextTests_1.contextTests.userAgent[0], utils_1.HTTP_STATUSES.OK_200);
            contextTests_1.contextTests.accessTokenUser1Device1 = accessToken;
            expect(accessToken).toBeDefined();
            expect(typeof accessToken).toBe('string');
            contextTests_1.contextTests.refreshTokenUser1Device1 = refreshToken;
            expect(refreshToken).toBeDefined();
            expect(typeof refreshToken).toBe('string');
        }));
        it('Должен возвращать 200 и информацию о пользователе!', () => __awaiter(void 0, void 0, void 0, function* () {
            yield authTestManager_1.authTestManager.getUserInfo(contextTests_1.contextTests.accessTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
        }));
        it('Должен возвращать 200, выдавать новую пару access и refresh tokens при посещении refresh-token, старый refreshToken в черный список!', () => __awaiter(void 0, void 0, void 0, function* () {
            const { response, refresh } = yield authTestManager_1.authTestManager.refreshToken(contextTests_1.contextTests.accessTokenUser1Device1, contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            contextTests_1.contextTests.accessTokenUser1Device1 = response.body.accessToken;
            expect(response.body.accessToken).toBeDefined();
            expect(typeof response.body.accessToken).toBe('string');
            contextTests_1.contextTests.refreshTokenUser1Device1 = refresh;
            expect(contextTests_1.contextTests.refreshTokenUser1Device1).toBeDefined();
            expect(typeof contextTests_1.contextTests.refreshTokenUser1Device1).toBe('string');
        }));
        it('Должен возвращать при logout 204 и заносить в черный список refreshToken!', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, testing_E2E_UserSessions_api_1.delay)(2000);
            const userData = {
                login: contextTests_1.contextTests.correctUserName1,
                password: contextTests_1.contextTests.correctUserPassword1,
                email: contextTests_1.contextTests.correctUserEmail1,
            };
            const authData = { loginOrEmail: userData.login, password: userData.password };
            const { accessToken, refreshToken } = yield authTestManager_1.authTestManager.login(authData, contextTests_1.contextTests.userAgent[0], utils_1.HTTP_STATUSES.OK_200);
            contextTests_1.contextTests.accessTokenUser1Device2 = accessToken;
            contextTests_1.contextTests.refreshTokenUser1Device2 = refreshToken;
            expect(contextTests_1.contextTests.accessTokenUser1Device2).toBeDefined();
            expect(typeof contextTests_1.contextTests.accessTokenUser1Device2).toBe('string');
            expect(contextTests_1.contextTests.refreshTokenUser1Device2).toBeDefined();
            expect(typeof contextTests_1.contextTests.refreshTokenUser1Device2).toBe('string');
            yield authTestManager_1.authTestManager.logout(contextTests_1.contextTests.accessTokenUser1Device2, contextTests_1.contextTests.refreshTokenUser1Device2, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const { response } = yield authTestManager_1.authTestManager.refreshToken(contextTests_1.contextTests.accessTokenUser1Device2, contextTests_1.contextTests.refreshTokenUser1Device2, utils_1.HTTP_STATUSES.UNAUTHORIZED_401);
            // console.log('TEST response: - ', response.body)
            expect(response.body[0].message).toBe('Онулирован refresh-token!');
        }));
    });
};
exports.authE2eTest = authE2eTest;
