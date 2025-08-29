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
exports.usersTestManager = exports.getRequest = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const utils_1 = require("../../utils/utils");
const settings_1 = require("../../settings");
const getRequest = () => {
    return (0, supertest_1.default)(app_1.app);
};
exports.getRequest = getRequest;
exports.usersTestManager = {
    getAllUsers(params_1) {
        return __awaiter(this, arguments, void 0, function* (params, expectedStatusCode = utils_1.HTTP_STATUSES.CREATED_201) {
            const response = yield (0, exports.getRequest)()
                .get(params ? `${settings_1.SETTINGS.RouterPath.users}${params}` : `${settings_1.SETTINGS.RouterPath.users}`)
                // .set('User-Agent', 'TestDevice/1.0')
                .expect(expectedStatusCode);
            // console.log('usersTestManager - res', response.body)
            return { response: response, getAllUsers: response.body };
        });
    },
    getUserById(id_1) {
        return __awaiter(this, arguments, void 0, function* (id, expectedStatusCode = utils_1.HTTP_STATUSES.CREATED_201) {
            const response = yield (0, exports.getRequest)()
                .get(`${settings_1.SETTINGS.RouterPath.users}/${id}`)
                // .set('User-Agent', 'TestDevice/1.0')
                .expect(expectedStatusCode);
            // console.log('usersTestManager - res', id)
            return { response: response, getUsersById: response.body };
        });
    },
    createUser(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, 
        // accessToken: string | undefined = undefined,
        codedAuth = undefined, expectedStatusCode = utils_1.HTTP_STATUSES.CREATED_201) {
            // console.log('usersTestManager - data', data)
            const response = yield (0, exports.getRequest)()
                .post(`${settings_1.SETTINGS.RouterPath.users}`)
                // .set('User-Agent', 'TestDevice/1.0')
                .set('Authorization', `Basic ${codedAuth}`)
                .send(data)
                .expect(expectedStatusCode);
            // console.log('usersTestManager - data', response.body)
            let createdEntity;
            // .set('Authorization', `Basic ${codedAuth}`)
            // .set('Authorization', `Bearer ${accessToken}`)
            if (expectedStatusCode === utils_1.HTTP_STATUSES.UNAUTHORIZED_401) {
                expect(expectedStatusCode);
            }
            if (expectedStatusCode === utils_1.HTTP_STATUSES.CREATED_201) {
                createdEntity = response.body;
                expect(createdEntity)
                    .toEqual({
                    id: expect.any(String),
                    login: data.login,
                    email: data.email,
                    createdAt: expect.any(String),
                });
            }
            return { response: response.body, createdEntity: createdEntity };
        });
    },
    updateUser(id_1, data_1) {
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
    deleteUser(userId_1) {
        return __awaiter(this, arguments, void 0, function* (userId, 
        // accessToken: string | undefined = undefined,
        codedAuth = undefined, expectedStatusCode = utils_1.HTTP_STATUSES.CREATED_201) {
            const response = yield (0, exports.getRequest)()
                .delete(`${settings_1.SETTINGS.RouterPath.users}/${userId}`)
                // .set('User-Agent', 'TestDevice/1.0')
                // .set('Authorization', `Bearer ${accessToken}`)
                .set('Authorization', `Basic ${codedAuth}`)
                .expect(expectedStatusCode);
            // console.log('usersTestManager - res', response.body)
            return { response: response, deleteUser: response.body };
        });
    },
    createArrayUsers() {
        return __awaiter(this, arguments, void 0, function* (count = 10, accessToken = undefined) {
            const users = [];
            for (let i = 0; i < count; i++) {
                const { createdEntity } = yield exports.usersTestManager.createUser({
                    login: `MyLogin${i}`,
                    password: `password${i}`,
                    email: `webmars${i}@mars.com`
                }, accessToken, utils_1.HTTP_STATUSES.CREATED_201);
                users.push(createdEntity);
            }
            // console.log('for: ', users)
            return users;
        });
    }
};
