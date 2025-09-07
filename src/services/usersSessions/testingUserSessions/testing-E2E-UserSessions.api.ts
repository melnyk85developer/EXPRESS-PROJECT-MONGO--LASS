import { JwtPayload } from "jsonwebtoken";
import { HTTP_STATUSES } from "../../../shared/utils/utils";
import { authTestManager } from "../../../shared/__tests__/managersTests/authTestManager";
import { usersSessionTestManager } from "../../../shared/__tests__/managersTests/userSessionTestManager";
import { contextTests } from "../../../shared/__tests__/contextTests";
import { delay } from "../../../shared/__tests__/all.test";
import { isCreatedUser1, isCreatedUser2 } from "../../users/testingUsers/testFunctionsUser";

export const usersSessionsE2eTest = () => {
    describe('E2E-USERS-SESSIONS', () => {
        beforeAll(async () => {
            const isUser1 = await isCreatedUser1(
                contextTests.correctUserName1,
                contextTests.correctUserEmail1,
                contextTests.correctUserPassword1,
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST: - isUser1 blogsE2eTest', isUser1)
            const isUser2 = await isCreatedUser2(
                contextTests.correctUserName2,
                contextTests.correctUserEmail2,
                contextTests.correctUserPassword2,
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST: - isUser2 usersSessionsE2eTest', isUser2)
        })
        it('Должен создать жменю сессий пользователя', async () => {
            const countSession = 4;
            for (let i = 0; i < countSession; i++) {
                await delay(1000)
                const { accessToken, refreshToken } = await authTestManager.login(
                    {
                        loginOrEmail: contextTests.correctUserName1,
                        password: contextTests.correctUserPassword1
                    },
                    contextTests.userAgent[i],
                    HTTP_STATUSES.OK_200
                )
                if (i === 0) {
                    contextTests.accessTokenUser1Device1 = accessToken,
                        contextTests.refreshTokenUser1Device1 = refreshToken
                    const userToken = await contextTests.tokenService.validateRefreshToken(contextTests.refreshTokenUser1Device1);
                    const foundDevice = await contextTests.usersSessionService._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
                    contextTests.session1User1 = foundDevice
                } else if (i === 1) {
                    contextTests.accessTokenUser1Device2 = accessToken,
                        contextTests.refreshTokenUser1Device2 = refreshToken
                    const userToken = await contextTests.tokenService.validateRefreshToken(contextTests.refreshTokenUser1Device2);
                    const foundDevice = await contextTests.usersSessionService._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
                    contextTests.session2User1 = foundDevice
                } else if (i === 2) {
                    contextTests.accessTokenUser1Device3 = accessToken,
                        contextTests.refreshTokenUser1Device3 = refreshToken
                    const userToken = await contextTests.tokenService.validateRefreshToken(contextTests.refreshTokenUser1Device3);
                    const foundDevice = await contextTests.usersSessionService._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
                    contextTests.session3User1 = foundDevice
                } else if (i === 3) {
                    contextTests.accessTokenUser1Device4 = accessToken,
                        contextTests.refreshTokenUser1Device4 = refreshToken
                    const userToken = await contextTests.tokenService.validateRefreshToken(contextTests.refreshTokenUser1Device4);
                    const foundDevice = await contextTests.usersSessionService._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
                    contextTests.session4User1 = foundDevice
                }
                contextTests.total_number_of_active_sessions_in_tests = i
            }
            const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(arrSessions.length).toBe(contextTests.total_number_of_active_sessions_in_tests)
        })
        it('Должен возвращать 403 при удалении чужой сессии пользователя!', async () => {
            const { refreshToken } = await authTestManager.login(
                {
                    loginOrEmail: contextTests.correctUserName2,
                    password: contextTests.correctUserPassword2
                },
                contextTests.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            await usersSessionTestManager.deleteSessionByDeviceId(
                contextTests.session4User1.deviceId,
                refreshToken!,
                HTTP_STATUSES.FORBIDDEN_403
            )
        })
        it('Должен возвращать 200, выдавать новую пару access и refresh tokens при посещении refresh-token, а так же заносить старый refreshToken в черный список!', async () => {
            const { arrSessions: userSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(userSessions.length).toBe(4)
            const { response, refresh } = await authTestManager.refreshToken(
                contextTests.accessTokenUser1Device1,
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            contextTests.accessTokenUser1Device1 = response.body.accessToken
            contextTests.refreshTokenUser1Device1 = refresh
            expect(contextTests.accessTokenUser1Device1).toBeDefined()
            expect(typeof contextTests.accessTokenUser1Device1).toBe('string')
            expect(contextTests.refreshTokenUser1Device1).toBeDefined()
            expect(typeof contextTests.refreshTokenUser1Device1).toBe('string')
            const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(arrSessions.length).toBe(4)
        })
        it('Должен возвращать 204 при успешном удалении сессии пользователя!', async () => {
            const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(arrSessions.length).toBe(4)
            await usersSessionTestManager.deleteSessionByDeviceId(
                contextTests.session2User1.deviceId,
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { response } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(response.length).toBe(3)
        })
        it('Должен возвращать при logout 204 и заносить в черный список refreshToken!', async () => {
            await delay(2000)
            await authTestManager.logout(
                contextTests.accessTokenUser1Device3,
                contextTests.refreshTokenUser1Device3,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { response } = await authTestManager.refreshToken(
                contextTests.accessTokenUser1Device3,
                contextTests.refreshTokenUser1Device3,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            expect(response.body[0].message).toBe('Онулирован refresh-token!')

            const { response: sessions } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(sessions.length).toBe(2)
            if (response.status === HTTP_STATUSES.NO_CONTENT_204) {
                contextTests.accessTokenUser1Device3 = null,
                contextTests.refreshTokenUser1Device3 = null
            }
        })
        it(`Должен удалить все сессии пользователя!`, async () => {
            const { response } = await usersSessionTestManager.deleteUserSessions(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(arrSessions.length).toBe(1)
            if (response.status === HTTP_STATUSES.NO_CONTENT_204) {
                contextTests.accessTokenUser2Device1 === null
                contextTests.refreshTokenUser2Device1 === null
                contextTests.total_number_of_active_sessions_in_tests = 1
            }
        })
        it.skip('Должен обновлять жизнь сессии при любых запросах на индпоинты!', async () => {
            const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST - getAllUserSession', getAllUserSession)
        })
    })
}