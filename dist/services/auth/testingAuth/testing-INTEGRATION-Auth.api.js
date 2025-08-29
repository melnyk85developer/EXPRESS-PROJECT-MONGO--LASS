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
exports.authIntegrationTest = exports.getRequest = void 0;
require("reflect-metadata");
// import { MongoDBCollection } from '../../src/db';
// import { authServices, tokenService } from "../../src/shared/container/compositionRootCustom";
const supertest_1 = __importDefault(require("supertest"));
const settings_1 = require("../../../shared/settings");
const app_1 = require("../../../app");
const utils_1 = require("../../../shared/utils/utils");
const compositionRootCustom_1 = require("../../../shared/container/compositionRootCustom");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
// const mongoDB: MongoDBCollection = container.resolve(MongoDBCollection)
// const authServices: AuthServices = container.resolve(AuthServices)
// const tokenService: TokenService = container.resolve(TokenService)
// const mongoDB: MongoDBCollection = container.get(MongoDBCollection)
// const authServices: AuthServices = container.get(AuthServices)
// const tokenService: TokenService = container.get(TokenService)
const getRequest = () => {
    return (0, supertest_1.default)(app_1.app);
};
exports.getRequest = getRequest;
const authIntegrationTest = () => {
    describe('AUTH-INTEGRATION', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, exports.getRequest)().delete(`${settings_1.SETTINGS.RouterPath.__test__}/all-data`);
        }));
        it('Должен успешно зарегистрировать пользователя и отправить письмо с активацией', () => __awaiter(void 0, void 0, void 0, function* () {
            const login = contextTests_1.contextTests.correctUserName1;
            const email = contextTests_1.contextTests.correctUserEmail1;
            const password = contextTests_1.contextTests.correctUserPassword1;
            compositionRootCustom_1.mailService.sendMail = jest.fn((from, to, subject, text, html) => {
                return Promise.resolve(true);
            });
            const result = yield compositionRootCustom_1.authServices.registrationServices(login, password, email);
            expect(compositionRootCustom_1.mailService.sendMail).toHaveBeenCalledWith(expect.any(String), email, expect.stringContaining('Активация аккаунта'), expect.any(String), expect.stringContaining('href="http://localhost:5006/auth/confirm-email'));
            expect(result).not.toBeNull();
        }));
        it('Должен успешно создать access-token', () => __awaiter(void 0, void 0, void 0, function* () {
            const tokens = yield compositionRootCustom_1.tokenService.generateTokens(contextTests_1.contextTests.payload, contextTests_1.contextTests.randomId);
            contextTests_1.contextTests.accessTokenUser1Device1 = tokens.accessToken;
            expect(contextTests_1.contextTests.accessTokenUser1Device1).toBeDefined();
            expect(typeof contextTests_1.contextTests.accessTokenUser1Device1).toBe('string');
        }));
        it('Должен успешно создать refresh-token', () => __awaiter(void 0, void 0, void 0, function* () {
            const tokens = yield compositionRootCustom_1.tokenService.generateTokens(contextTests_1.contextTests.payload, contextTests_1.contextTests.randomId);
            contextTests_1.contextTests.refreshTokenUser1Device1 = tokens.refreshToken;
            expect(contextTests_1.contextTests.refreshTokenUser1Device1).toBeDefined();
            expect(typeof contextTests_1.contextTests.refreshTokenUser1Device1).toBe('string');
        }));
        it('Должен успешно валидировать access-token', () => __awaiter(void 0, void 0, void 0, function* () {
            const decoded = yield compositionRootCustom_1.tokenService.validateRefreshToken(`Bearer ${contextTests_1.contextTests.accessTokenUser1Device1}`);
            expect(decoded).toBeDefined();
        }));
        it('Должен успешно валидировать refresh-token', () => __awaiter(void 0, void 0, void 0, function* () {
            const decoded = yield compositionRootCustom_1.tokenService.validateRefreshToken(contextTests_1.contextTests.refreshTokenUser1Device1);
            expect(decoded).toBeDefined();
        }));
        it('Должен выбрасывать ошибку при неверном refresh-token', () => __awaiter(void 0, void 0, void 0, function* () {
            const decoded = yield compositionRootCustom_1.tokenService.validateRefreshToken(contextTests_1.contextTests.invalidToken);
            expect(decoded).toBe(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT);
        }));
        it('Должен выбрасывать ошибку при неверном access-token', () => __awaiter(void 0, void 0, void 0, function* () {
            const decoded = yield compositionRootCustom_1.tokenService.validateAccessToken(contextTests_1.contextTests.invalidToken);
            expect(decoded).toBe(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
        }));
    });
};
exports.authIntegrationTest = authIntegrationTest;
