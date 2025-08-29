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
exports.blogsTestManager = exports.getRequest = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../../app");
const utils_1 = require("../../utils/utils");
const settings_1 = require("../../settings");
const getRequest = () => {
    return (0, supertest_1.default)(app_1.app);
};
exports.getRequest = getRequest;
exports.blogsTestManager = {
    getAllBlogs() {
        return __awaiter(this, arguments, void 0, function* (expectedStatusCode = utils_1.HTTP_STATUSES.CREATED_201) {
            const response = yield (0, exports.getRequest)()
                .get(settings_1.SETTINGS.RouterPath.blogs)
                // .set('User-Agent', 'TestDevice/1.0')
                .expect(expectedStatusCode);
            let getBlogs;
            return { response: response, getBlogs: response.body };
        });
    },
    getBlogsById(blogId_1) {
        return __awaiter(this, arguments, void 0, function* (blogId, expectedStatusCode = utils_1.HTTP_STATUSES.CREATED_201) {
            const response = yield (0, exports.getRequest)()
                .get(`${settings_1.SETTINGS.RouterPath.blogs}/${blogId}`)
                // .set('User-Agent', 'TestDevice/1.0')
                .expect(expectedStatusCode);
            // console.log('getBlogsById: - ', response.body)
            const getBlog = null;
            return { response: response, getBlog: response.body };
        });
    },
    createBlogs(data_1, codedAuth_1) {
        return __awaiter(this, arguments, void 0, function* (data, codedAuth, expectedStatusCode = utils_1.HTTP_STATUSES.CREATED_201) {
            const response = yield (0, exports.getRequest)()
                .post(settings_1.SETTINGS.RouterPath.blogs)
                // .set('Authorization', `Bearer ${accessToken}`)
                // .set('User-Agent', 'TestDevice/1.0')
                .set('Authorization', `Basic ${codedAuth}`)
                .send(data)
                .expect(expectedStatusCode);
            let createdEntity;
            if (expectedStatusCode === utils_1.HTTP_STATUSES.UNAUTHORIZED_401) {
                expect(expectedStatusCode);
            }
            if (expectedStatusCode === utils_1.HTTP_STATUSES.CREATED_201) {
                createdEntity = response.body;
                expect(createdEntity)
                    .toEqual({
                    id: expect.any(String),
                    name: data.name,
                    description: data.description,
                    websiteUrl: data.websiteUrl,
                    createdAt: expect.any(String),
                    isMembership: expect.any(Boolean),
                });
            }
            return { bodyBlog: response.body, createdEntity: createdEntity };
        });
    },
    updateBlogs(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, codedAuth = undefined, blogId, expectedStatusCode = utils_1.HTTP_STATUSES.NO_CONTENT_204) {
            yield (0, exports.getRequest)()
                .put(`${settings_1.SETTINGS.RouterPath.blogs}/${blogId}`)
                // .set('User-Agent', 'TestDevice/1.0')
                // .set('Authorization', `Bearer ${accessToken}`)
                .set('Authorization', `Basic ${codedAuth}`)
                .send(data)
                .expect(expectedStatusCode);
        });
    },
    deleteBlogs(blogId_1) {
        return __awaiter(this, arguments, void 0, function* (blogId, codedAuth = undefined, 
        // accessToken: string | undefined = undefined,
        expectedStatusCode = utils_1.HTTP_STATUSES.CREATED_201) {
            // console.log('deleteBlogs: - accessToken', blogId, accessToken)
            yield (0, exports.getRequest)()
                .delete(`${settings_1.SETTINGS.RouterPath.blogs}/${blogId}`)
                // .set('User-Agent', 'TestDevice/1.0')
                // .set('Authorization', `Bearer ${accessToken}`)
                .set('Authorization', `Basic ${codedAuth}`)
                .expect(expectedStatusCode);
        });
    }
};
// cookies: string[] = [],  // Куки передаются сюда вместо авторизации,
// .set('Cookie', cookies)  // Устанавливаем куки для запроса
