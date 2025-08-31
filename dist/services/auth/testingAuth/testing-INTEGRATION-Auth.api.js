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
exports.authIntegrationTest = void 0;
const settings_1 = require("../../../shared/settings");
const utils_1 = require("../../../shared/utils/utils");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
const authServices_1 = require("../authServices");
const emailAdapter_1 = require("../../../shared/infrastructure/emailAdapter");
const iocRoot_1 = require("../../../shared/container/iocRoot");
const tokenService_1 = require("../../../shared/infrastructure/tokenService");
const authTestManager_1 = require("../../../shared/__tests__/managersTests/authTestManager");
const tokenService = iocRoot_1.container.get(tokenService_1.TokenService);
const authServices = iocRoot_1.container.get(authServices_1.AuthServices);
const mailService = iocRoot_1.container.get(emailAdapter_1.MailService);
const authIntegrationTest = () => {
    describe('AUTH-INTEGRATION', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, authTestManager_1.getRequest)().delete(`${settings_1.SETTINGS.RouterPath.__test__}/all-data`);
        }));
        it('Должен успешно зарегистрировать пользователя и отправить письмо с активацией', () => __awaiter(void 0, void 0, void 0, function* () {
            const login = contextTests_1.contextTests.correctUserName1;
            const email = contextTests_1.contextTests.correctUserEmail1;
            const password = contextTests_1.contextTests.correctUserPassword1;
            mailService.sendMail = jest.fn((from, to, subject, text, html) => {
                return Promise.resolve(true);
            });
            const result = yield authServices.registrationServices(login, password, email);
            expect(mailService.sendMail).toHaveBeenCalledWith(expect.any(String), email, expect.stringContaining('Активация аккаунта'), expect.any(String), expect.stringContaining('href="http://localhost:5006/auth/confirm-email'));
            expect(result).not.toBeNull();
        }));
        it('Должен успешно создать access-token', () => __awaiter(void 0, void 0, void 0, function* () {
            const tokens = yield tokenService.generateTokens(contextTests_1.contextTests.payload, contextTests_1.contextTests.randomId);
            contextTests_1.contextTests.accessTokenUser1Device1 = tokens.accessToken;
            expect(contextTests_1.contextTests.accessTokenUser1Device1).toBeDefined();
            expect(typeof contextTests_1.contextTests.accessTokenUser1Device1).toBe('string');
        }));
        it('Должен успешно создать refresh-token', () => __awaiter(void 0, void 0, void 0, function* () {
            const tokens = yield tokenService.generateTokens(contextTests_1.contextTests.payload, contextTests_1.contextTests.randomId);
            contextTests_1.contextTests.refreshTokenUser1Device1 = tokens.refreshToken;
            expect(contextTests_1.contextTests.refreshTokenUser1Device1).toBeDefined();
            expect(typeof contextTests_1.contextTests.refreshTokenUser1Device1).toBe('string');
        }));
        it('Должен успешно валидировать access-token', () => __awaiter(void 0, void 0, void 0, function* () {
            const decoded = yield tokenService.validateRefreshToken(`Bearer ${contextTests_1.contextTests.accessTokenUser1Device1}`);
            expect(decoded).toBeDefined();
        }));
        it('Должен успешно валидировать refresh-token', () => __awaiter(void 0, void 0, void 0, function* () {
            const decoded = yield tokenService.validateRefreshToken(contextTests_1.contextTests.refreshTokenUser1Device1);
            expect(decoded).toBeDefined();
        }));
        it('Должен выбрасывать ошибку при неверном refresh-token', () => __awaiter(void 0, void 0, void 0, function* () {
            const decoded = yield tokenService.validateRefreshToken(contextTests_1.contextTests.invalidToken);
            expect(decoded).toBe(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT);
        }));
        it('Должен выбрасывать ошибку при неверном access-token', () => __awaiter(void 0, void 0, void 0, function* () {
            const decoded = yield tokenService.validateAccessToken(contextTests_1.contextTests.invalidToken);
            expect(decoded).toBe(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
        }));
    });
};
exports.authIntegrationTest = authIntegrationTest;
