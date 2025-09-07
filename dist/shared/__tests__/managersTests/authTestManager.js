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
exports.authTestManager = exports.getRequest = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const utils_1 = require("../../utils/utils");
const settings_1 = require("../../settings");
const getRequest = () => {
    return (0, supertest_1.default)(app_1.app);
};
exports.getRequest = getRequest;
exports.authTestManager = {
    registration(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, expectedStatusCode = utils_1.HTTP_STATUSES.NO_CONTENT_204) {
            // console.log('authTestManager - data', data)
            const response = yield (0, exports.getRequest)()
                .post(`${settings_1.SETTINGS.RouterPath.auth}/registration`)
                .send(data)
                .set('User-Agent', 'TestDevice/1.0')
                .expect(expectedStatusCode);
            // console.log('authTestManager - res', response.body)
            return { response: response, body: response.body };
        });
    },
    login(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, userAgent = 'TestDevice/1.0', expectedStatusCode = utils_1.HTTP_STATUSES.OK_200) {
            var _a, _b, _c, _d;
            const response = yield (0, exports.getRequest)()
                .post(`${settings_1.SETTINGS.RouterPath.auth}/login`)
                .send(data)
                .set('User-Agent', `${userAgent}`)
                .expect(expectedStatusCode);
            const authHeader = response.headers['authorization'];
            const token = authHeader ? authHeader.split(' ')[1] : null;
            const accessToken = (_a = response.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            const refreshToken = (_d = (_c = (_b = response.headers['set-cookie']) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.split(';')[0]) === null || _d === void 0 ? void 0 : _d.split('=')[1];
            return { response: response, accessToken, refreshToken };
        });
    },
    getUserInfo(accessToken_1) {
        return __awaiter(this, arguments, void 0, function* (accessToken, expectedStatusCode = utils_1.HTTP_STATUSES.OK_200) {
            // console.log('authTestManager - data', data)
            const response = yield (0, exports.getRequest)()
                .get(`${settings_1.SETTINGS.RouterPath.auth}/me`)
                // .set('User-Agent', 'TestDevice/1.0')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(expectedStatusCode);
            let userInfo = null;
            if (expectedStatusCode === utils_1.HTTP_STATUSES.OK_200) {
                userInfo = response.body;
                expect(userInfo)
                    .toEqual({
                    userId: expect.any(String),
                    login: expect.any(String),
                    email: expect.any(String),
                });
            }
            // console.log('authTestManager - response.body', response.body)
            return { response: response, userInfo: response.body };
        });
    },
    logout(accessToken_1, refreshToken_1) {
        return __awaiter(this, arguments, void 0, function* (accessToken, refreshToken, expectedStatusCode = utils_1.HTTP_STATUSES.NO_CONTENT_204) {
            // console.log('accessToken: - ', accessToken)
            // console.log('refreshToken: - ', refreshToken)
            const response = yield (0, exports.getRequest)()
                .post(`${settings_1.SETTINGS.RouterPath.auth}/logout`)
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .expect(expectedStatusCode);
            if (expectedStatusCode === utils_1.HTTP_STATUSES.NO_CONTENT_204) {
                const clearedCookies = response.headers['set-cookie'];
                expect(clearedCookies).toBeDefined();
                expect(clearedCookies[0]).toContain('refreshToken=;');
                return { status: utils_1.HTTP_STATUSES.NO_CONTENT_204 };
            }
            else {
                return { status: response.status };
            }
        });
    },
    refreshToken(accessToken_1, refreshToken_1) {
        return __awaiter(this, arguments, void 0, function* (accessToken, refreshToken, expectedStatusCode = utils_1.HTTP_STATUSES.OK_200) {
            // console.log('TEST authTestManager refreshToken: - req', refreshToken)
            var _a, _b;
            const response = yield (0, exports.getRequest)()
                .post(`${settings_1.SETTINGS.RouterPath.auth}/refresh-token`)
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .expect(expectedStatusCode);
            // console.log('TEST authTestManager refreshToken: - response', response.body)
            // Проверяем заголовок 'set-cookie'
            const setCookieHeader = response.headers['set-cookie'];
            // let extractedRefreshToken = setCookieHeader ? setCookieHeader[0] : null;
            let extractedRefreshToken = '';
            if (Array.isArray(setCookieHeader)) {
                // Если это массив строк
                extractedRefreshToken = (_b = (_a = setCookieHeader
                    .find((cookie) => cookie.startsWith('refreshToken='))) === null || _a === void 0 ? void 0 : _a.split('=')[1]) === null || _b === void 0 ? void 0 : _b.split(';')[0];
            }
            else if (typeof setCookieHeader === 'string') {
                // Если это одна строка
                if (setCookieHeader.startsWith('refreshToken=')) {
                    extractedRefreshToken = setCookieHeader
                        .split('=')[1]
                        .split(';')[0];
                }
            }
            return { response: response, refresh: extractedRefreshToken };
        });
    }
};
