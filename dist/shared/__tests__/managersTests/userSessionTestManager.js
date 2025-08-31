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
exports.usersSessionTestManager = exports.getRequest = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const settings_1 = require("../../settings");
const utils_1 = require("../../utils/utils");
const iocRoot_1 = require("../../container/iocRoot");
const tokenService_1 = require("../../infrastructure/tokenService");
const securityDeviceService_1 = require("../../../services/usersSessions/securityDeviceService");
// import { securityDeviceServices, tokenService } from "../../../src/shared/container/compositionRootCustom";
const tokenService = iocRoot_1.container.get(tokenService_1.TokenService);
const securityDeviceServices = iocRoot_1.container.get(securityDeviceService_1.SecurityDeviceServices);
const getRequest = () => {
    return (0, supertest_1.default)(app_1.app);
};
exports.getRequest = getRequest;
const buff2 = Buffer.from(settings_1.SETTINGS.ADMIN, 'utf8');
const codedAuth = buff2.toString('base64');
exports.usersSessionTestManager = {
    getAllUserSessionByUserId(refreshToken_1) {
        return __awaiter(this, arguments, void 0, function* (refreshToken, expectedStatusCode = utils_1.HTTP_STATUSES.OK_200) {
            // console.log('getAllUserSessionByUserId: - ', accessToken, refreshToken)
            const response = yield (0, exports.getRequest)()
                .get(`${settings_1.SETTINGS.RouterPath.security}/devices`)
                // .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .expect(expectedStatusCode);
            // console.log('usersTestManager - res', response.body)
            let arrSessions = response.body;
            const userToken = yield tokenService.validateRefreshToken(refreshToken);
            expect(Array.isArray(arrSessions)).toBe(true);
            expect(arrSessions).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    ip: expect.any(String),
                    title: expect.any(String),
                    deviceId: expect.any(String),
                    lastActiveDate: expect.any(String)
                })
            ]));
            return { response: response.body, arrSessions: arrSessions };
        });
    },
    getSessionUserById(deviceId_1, accessToken_1, refreshToken_1) {
        return __awaiter(this, arguments, void 0, function* (deviceId, accessToken, refreshToken, expectedStatusCode = utils_1.HTTP_STATUSES.OK_200) {
            const response = yield (0, exports.getRequest)()
                .get(`${settings_1.SETTINGS.RouterPath.security}/devices/${deviceId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .expect(expectedStatusCode);
            // console.log('usersTestManager - res', id)
            return { response: response, resSessionUserById: response.body };
        });
    },
    updateUserSession(id_1, data_1) {
        return __awaiter(this, arguments, void 0, function* (id, data, codedAuth = undefined, expectedStatusCode = utils_1.HTTP_STATUSES.NO_CONTENT_204) {
            // console.log('usersTestManager - updateUser data, codedAuth', data, codedAuth)
            const response = yield (0, exports.getRequest)()
                .put(`${settings_1.SETTINGS.RouterPath.users}/${id}`)
                // .set('User-Agent', 'TestDevice/1.0')
                .set('Authorization', `Basic ${codedAuth}`)
                .send(data)
                .expect(expectedStatusCode);
            let updateUser;
            // accessToken: string | undefined = undefined,
            // .set('Authorization', `Bearer ${accessToken}`)
            // console.log('usersTestManager - ', accessToken)
            if (expectedStatusCode === utils_1.HTTP_STATUSES.UNAUTHORIZED_401) {
                expect(expectedStatusCode);
            }
            if (expectedStatusCode === utils_1.HTTP_STATUSES.NO_CONTENT_204) {
                updateUser = response.body;
            }
            return { response: response, updateUser: updateUser };
        });
    },
    deleteUserSessions(refreshToken_1) {
        return __awaiter(this, arguments, void 0, function* (refreshToken, expectedStatusCode = utils_1.HTTP_STATUSES.NO_CONTENT_204) {
            // console.log('deleteUserSessions - res accessToken & refreshToken', accessToken, refreshToken)
            const response = yield (0, exports.getRequest)()
                .delete(`${settings_1.SETTINGS.RouterPath.security}/devices`)
                // .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .expect(expectedStatusCode);
            // console.log('usersTestManager - res', response.body)
            let isDeleted = response.body;
            return { response: response.body, isDeleted: isDeleted };
        });
    },
    deleteSessionByDeviceId(deviceId_1, refreshToken_1) {
        return __awaiter(this, arguments, void 0, function* (deviceId, refreshToken, expectedStatusCode = utils_1.HTTP_STATUSES.NO_CONTENT_204) {
            const response = yield (0, exports.getRequest)()
                .delete(`${settings_1.SETTINGS.RouterPath.security}/devices/${deviceId}`)
                // .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .expect(expectedStatusCode);
            // console.log('usersTestManager - res', response.body)
            return { response: response, deleteUser: response.body };
        });
    },
    createArrayUsersSessions() {
        return __awaiter(this, arguments, void 0, function* (count = 10, codedAuth = undefined, authToken2 = null) {
            const userToken = yield tokenService.validateRefreshToken(authToken2);
            for (let i = 0; i < count; i++) {
                yield securityDeviceServices.createSessionServices(userToken.userId.toString(), `::ffff:127.0.0.${i}`, `user-agent/INTEGRATION-TEST/0.${i}}`);
            }
        });
    },
    getAllUsersSessions(accessToken_1, refreshToken_1) {
        return __awaiter(this, arguments, void 0, function* (accessToken, refreshToken, expectedStatusCode = utils_1.HTTP_STATUSES.OK_200) {
            const response = yield (0, exports.getRequest)()
                .get(`${settings_1.SETTINGS.RouterPath.security}/devices-all`)
                .set('Authorization', `Bearer ${accessToken}`)
                .set('Cookie', `refreshToken=${refreshToken}`)
                .expect(expectedStatusCode);
            // console.log('usersTestManager - res', response.body)
            return { response: response, getAllUserSession: response.body };
        });
    },
};
