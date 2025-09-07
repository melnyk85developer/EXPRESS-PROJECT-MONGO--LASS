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
exports.usersSessionsInegrationTest = void 0;
const utils_1 = require("../../../shared/utils/utils");
const userSessionTestManager_1 = require("../../../shared/__tests__/managersTests/userSessionTestManager");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
const testFunctionsUser_1 = require("../../users/testingUsers/testFunctionsUser");
const testFunctionsAuth_1 = require("../../auth/testingAuth/testFunctionsAuth");
const usersSessionsInegrationTest = () => {
    describe('SESSIONS-INTEGRATION-TEST', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const isUser3 = yield (0, testFunctionsUser_1.isCreatedUser3)(contextTests_1.contextTests.correctUserName3, contextTests_1.contextTests.correctUserEmail3, contextTests_1.contextTests.correctUserPassword3, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            console.log('TEST: - isUser1 blogsE2eTest', isUser3);
            const isLogin = yield (0, testFunctionsAuth_1.isLoginUser3)(contextTests_1.contextTests.accessTokenUser3Device1, contextTests_1.contextTests.refreshTokenUser3Device1, contextTests_1.contextTests.correctUserEmail3, contextTests_1.contextTests.correctUserPassword3, contextTests_1.contextTests.userAgent[0], utils_1.HTTP_STATUSES.OK_200);
        }));
        it('Должен успешно создать сессию!', () => __awaiter(void 0, void 0, void 0, function* () {
            const count = 5;
            console.log('usersSessionTestManager: - ', contextTests_1.contextTests.refreshTokenUser3Device1);
            const userToken = yield contextTests_1.contextTests.tokenService.validateRefreshToken(contextTests_1.contextTests.refreshTokenUser3Device1);
            for (let i = 0; i < count; i++) {
                yield contextTests_1.contextTests.usersSessionService.createSessionServices(userToken.userId.toString(), `::ffff:127.0.0.${i}`, `${contextTests_1.contextTests.userAgent[i]}`);
                contextTests_1.contextTests.total_number_of_active_sessions_in_tests++;
            }
            const { arrSessions } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser3Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(arrSessions.length).toBe(count);
            yield userSessionTestManager_1.usersSessionTestManager.deleteUserSessions(contextTests_1.contextTests.refreshTokenUser3Device1, utils_1.HTTP_STATUSES.NO_CONTENT_204);
            const { response } = yield userSessionTestManager_1.usersSessionTestManager.getAllUserSessionByUserId(contextTests_1.contextTests.refreshTokenUser3Device1, utils_1.HTTP_STATUSES.OK_200);
            expect(response.length).toBe(1);
        }));
    });
};
exports.usersSessionsInegrationTest = usersSessionsInegrationTest;
