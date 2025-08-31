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
exports.usersSessionsInegrationTest = exports.getRequest = void 0;
const supertest_1 = __importDefault(require("supertest"));
const settings_1 = require("../../../shared/settings");
const app_1 = require("../../../app");
const utils_1 = require("../../../shared/utils/utils");
const usersTestManager_1 = require("../../../shared/__tests__/managersTests/usersTestManager");
const authTestManager_1 = require("../../../shared/__tests__/managersTests/authTestManager");
const userSessionTestManager_1 = require("../../../shared/__tests__/managersTests/userSessionTestManager");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
// import { container } from '../../src/shared/container/iocRoot';
// import { MongoDBCollection } from '../../src/db';
// const mongoDB: MongoDBCollection = container.get(MongoDBCollection)
const getRequest = () => {
    return (0, supertest_1.default)(app_1.app);
};
exports.getRequest = getRequest;
const usersSessionsInegrationTest = () => {
    describe('SESSIONS-INTEGRATION-TEST', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            // await mongoDB.connectDB();
            yield (0, exports.getRequest)().delete(`${settings_1.SETTINGS.RouterPath.__test__}/all-data`);
            const data = {
                login: contextTests_1.contextTests.correctUserName1,
                password: contextTests_1.contextTests.correctUserPassword1,
                email: contextTests_1.contextTests.correctUserEmail1
            };
            const { response } = yield usersTestManager_1.usersTestManager.createUser(data, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdUser1 = response;
            const { accessToken, refreshToken } = yield authTestManager_1.authTestManager.login({
                loginOrEmail: contextTests_1.contextTests.correctUserName1,
                password: contextTests_1.contextTests.correctUserPassword1
            }, contextTests_1.contextTests.userAgent[6], utils_1.HTTP_STATUSES.OK_200);
            contextTests_1.contextTests.accessTokenUser1Device1 = accessToken,
                contextTests_1.contextTests.refreshTokenUser1Device1 = refreshToken;
        }));
        it('Должен успешно создать сессию!', () => __awaiter(void 0, void 0, void 0, function* () {
            const count = 5;
            yield userSessionTestManager_1.usersSessionTestManager.createArrayUsersSessions(count, contextTests_1.contextTests.codedAuth, contextTests_1.contextTests.refreshTokenUser1Device1);
            const { arrSessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(arrSessions.length).toBe(count + 1);
            yield userSessionTestManager_1.usersSessionTestManager.deleteUserSessions(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const { response } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser1Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(response.length).toBe(1);
        }));
    });
};
exports.usersSessionsInegrationTest = usersSessionsInegrationTest;
