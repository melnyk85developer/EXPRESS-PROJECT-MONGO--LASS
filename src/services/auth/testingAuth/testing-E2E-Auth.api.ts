import { HTTP_STATUSES } from '../../../shared/utils/utils';
import { authTestManager } from '../../../shared/__tests__/managersTests/authTestManager';
import { contextTests } from '../../../shared/__tests__/contextTests';
import { usersTestManager } from '../../../shared/__tests__/managersTests/usersTestManager';
import { delay } from '../../../shared/__tests__/all.test';

export const authE2eTest = () => {
    describe('E2E-AUTH', () => {
        it('Должен возвращать 204 при успешной регистрации!', async () => {
            await authTestManager.registration(
                {
                    login: contextTests.correctUserName1,
                    password: contextTests.correctUserPassword1,
                    email: contextTests.correctUserEmail1
                },
                HTTP_STATUSES.NO_CONTENT_204
            )
        })
        it('Должен возвращать 400 при занятом логине во время ругистрации!', async () => {
            await authTestManager.registration(
                {
                    login: contextTests.correctUserName1,
                    password: contextTests.correctUserPassword1,
                    email: contextTests.correctUserEmail1
                },
                HTTP_STATUSES.BAD_REQUEST_400
            )
        })
        it('Должен возвращать 200 при успешной авторизации!', async () => {
            const authData = {
                loginOrEmail: contextTests.correctUserName1,
                password: contextTests.correctUserPassword1
            }
            const { accessToken, refreshToken, response } = await authTestManager.login(
                authData,
                contextTests.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            contextTests.accessTokenUser1Device1 = accessToken
            expect(accessToken).toBeDefined()
            expect(typeof accessToken).toBe('string')
            contextTests.refreshTokenUser1Device1 = refreshToken
            expect(refreshToken).toBeDefined()
            expect(typeof refreshToken).toBe('string')

            if (response.status === HTTP_STATUSES.OK_200) {
                contextTests.total_number_of_active_sessions_in_tests++
            }
        })
        it('Должен возвращать 200 при повторной авторизации с этого же устройства!', async () => {
            const { accessToken, refreshToken } = await authTestManager.login(
                {
                    loginOrEmail: contextTests.correctUserName1,
                    password: contextTests.correctUserPassword1
                },
                contextTests.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            contextTests.accessTokenUser1Device1 = accessToken
            expect(accessToken).toBeDefined()
            expect(typeof accessToken).toBe('string')
            contextTests.refreshTokenUser1Device1 = refreshToken
            expect(refreshToken).toBeDefined()
            expect(typeof refreshToken).toBe('string')
        })
        it('Должен возвращать 200 и информацию о пользователе!', async () => {
            const { userInfo } = await authTestManager.getUserInfo(
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            const { getUsersById } = await usersTestManager.getUserById(
                userInfo.userId,
                HTTP_STATUSES.OK_200
            )
            contextTests.createdUser1 = getUsersById
        })
        it('Должен возвращать 200, выдавать новую пару access и refresh tokens при посещении refresh-token, старый refreshToken в черный список!', async () => {
            const { response, refresh } = await authTestManager.refreshToken(
                contextTests.accessTokenUser1Device1,
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            contextTests.accessTokenUser1Device1 = response.body.accessToken
            expect(response.body.accessToken).toBeDefined()
            expect(typeof response.body.accessToken).toBe('string')
            contextTests.refreshTokenUser1Device1 = refresh
            expect(contextTests.refreshTokenUser1Device1).toBeDefined()
            expect(typeof contextTests.refreshTokenUser1Device1).toBe('string')
        })
        it('Должен возвращать при logout 204 и заносить в черный список refreshToken!', async () => {
            await delay(2000)

            const { accessToken, refreshToken } = await authTestManager.login(
                {
                    loginOrEmail: contextTests.correctUserName1,
                    password: contextTests.correctUserPassword1,
                },
                contextTests.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            contextTests.accessTokenUser1Device1 = accessToken
            contextTests.refreshTokenUser1Device1 = refreshToken

            expect(contextTests.accessTokenUser1Device1).toBeDefined()
            expect(typeof contextTests.accessTokenUser1Device1).toBe('string')
            expect(contextTests.refreshTokenUser1Device1).toBeDefined()
            expect(typeof contextTests.refreshTokenUser1Device1).toBe('string')

            const { status } = await authTestManager.logout(
                contextTests.accessTokenUser1Device1,
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.NO_CONTENT_204
            )

            const { response } = await authTestManager.refreshToken(
                contextTests.accessTokenUser1Device1,
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            expect(response.body[0].message).toBe('Онулирован refresh-token!')

            if (status === HTTP_STATUSES.NO_CONTENT_204) {
                contextTests.accessTokenUser1Device1 = null
                contextTests.refreshTokenUser1Device1 = null
                contextTests.total_number_of_active_sessions_in_tests --
            }
        })
    })
}