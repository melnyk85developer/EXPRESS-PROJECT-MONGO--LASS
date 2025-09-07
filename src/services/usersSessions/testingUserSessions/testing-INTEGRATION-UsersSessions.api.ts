import { HTTP_STATUSES } from "../../../shared/utils/utils";
import { usersSessionTestManager } from '../../../shared/__tests__/managersTests/userSessionTestManager';
import { contextTests } from '../../../shared/__tests__/contextTests';
import { isCreatedUser3 } from "../../users/testingUsers/testFunctionsUser";
import { isLoginUser3 } from "../../auth/testingAuth/testFunctionsAuth";
import { JwtPayload } from "jsonwebtoken";

export const usersSessionsInegrationTest = () => {
    describe('SESSIONS-INTEGRATION-TEST', () => {
        beforeAll(async () => {
            const isUser3 = await isCreatedUser3(
                contextTests.correctUserName3,
                contextTests.correctUserEmail3,
                contextTests.correctUserPassword3,
                HTTP_STATUSES.NO_CONTENT_204
            )
            console.log('TEST: - isUser1 blogsE2eTest', isUser3)
            const isLogin = await isLoginUser3(
                contextTests.accessTokenUser3Device1,
                contextTests.refreshTokenUser3Device1,
                contextTests.correctUserEmail3,
                contextTests.correctUserPassword3,
                contextTests.userAgent[0],
                HTTP_STATUSES.OK_200
            )
        })
        it('Должен успешно создать сессию!', async () => {
            const count = 5;
            console.log('usersSessionTestManager: - ', contextTests.refreshTokenUser3Device1)
            
            const userToken = await contextTests.tokenService.validateRefreshToken(contextTests.refreshTokenUser3Device1);
            for (let i = 0; i < count; i++) {
                await contextTests.usersSessionService.createSessionServices(
                    (userToken as JwtPayload & { userId: string }).userId.toString(),
                    `::ffff:127.0.0.${i}`,
                    `${contextTests.userAgent[i]}`
                )
                contextTests.total_number_of_active_sessions_in_tests ++
            }
            const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser3Device1,
                HTTP_STATUSES.OK_200
            )
            expect(arrSessions.length).toBe(count)
            await usersSessionTestManager.deleteUserSessions(
                contextTests.refreshTokenUser3Device1,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { response } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser3Device1,
                HTTP_STATUSES.OK_200
            )
            expect(response.length).toBe(1)
        })
    })
}
