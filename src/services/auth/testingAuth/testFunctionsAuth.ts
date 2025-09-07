import { contextTests } from "../../../shared/__tests__/contextTests";
import { authTestManager } from "../../../shared/__tests__/managersTests/authTestManager";
import { usersTestManager } from "../../../shared/__tests__/managersTests/usersTestManager";
import { HTTP_STATUSES } from "../../../shared/utils/utils";

export const isLoginUser1 = async (access: string | null, refresh: string | null, email: string, password: string, userAgent: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.accessTokenUser1Device1) {
        const { accessToken, refreshToken, response } = await authTestManager.login(
            {
                loginOrEmail: email,
                password: password
            },
            userAgent,
            statusCode
        )
        if (response.status === statusCode) {
            contextTests.accessTokenUser1Device1 = accessToken
            expect(accessToken).toBeDefined()
            expect(typeof accessToken).toBe('string')
            contextTests.refreshTokenUser1Device1 = refreshToken
            expect(refreshToken).toBeDefined()
            expect(typeof refreshToken).toBe('string')

            const { userInfo } = await authTestManager.getUserInfo(
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            const { getUsersById } = await usersTestManager.getUserById(
                userInfo.userId,
                HTTP_STATUSES.OK_200
            )
            contextTests.createdUser1 = getUsersById

            contextTests.total_number_of_active_sessions_in_tests++
            return { authData: { accessToken, refreshToken }, response }
        } else {
            return response.body
        }
    }
}
export const isLoginUser2 = async (access: string, refresh: string, email: string, password: string, userAgent: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.accessTokenUser2Device1) {
        const { accessToken, refreshToken, response } = await authTestManager.login(
            {
                loginOrEmail: email,
                password: password
            },
            userAgent,
            statusCode
        )
        console.log('TEST isLoginUser1: - authData', contextTests.accessTokenUser2Device1, contextTests.refreshTokenUser2Device1)
        if (response.status === statusCode) {
            contextTests.accessTokenUser2Device1 = accessToken
            expect(accessToken).toBeDefined()
            expect(typeof accessToken).toBe('string')
            contextTests.refreshTokenUser2Device1 = refreshToken
            expect(refreshToken).toBeDefined()
            expect(typeof refreshToken).toBe('string')

            const { userInfo } = await authTestManager.getUserInfo(
                contextTests.accessTokenUser2Device1,
                HTTP_STATUSES.OK_200
            )
            const { getUsersById } = await usersTestManager.getUserById(
                userInfo.userId,
                HTTP_STATUSES.OK_200
            )
            contextTests.createdUser2 = getUsersById

            contextTests.total_number_of_active_sessions_in_tests++
            return { authData: { accessToken, refreshToken }, response }
        } else {
            return response.body
        }
    }
}
export const isLoginUser3 = async (access: string, refresh: string, email: string, password: string, userAgent: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.accessTokenUser3Device1) {
        const { accessToken, refreshToken, response } = await authTestManager.login(
            {
                loginOrEmail: email,
                password: password
            },
            userAgent,
            statusCode
        )
        console.log('TEST isLoginUser1: - authData', contextTests.accessTokenUser3Device1, contextTests.refreshTokenUser3Device1)
        if (response.status === statusCode) {
            contextTests.accessTokenUser3Device1 = accessToken
            expect(accessToken).toBeDefined()
            expect(typeof accessToken).toBe('string')
            contextTests.refreshTokenUser3Device1 = refreshToken
            expect(refreshToken).toBeDefined()
            expect(typeof refreshToken).toBe('string')

            const { userInfo } = await authTestManager.getUserInfo(
                contextTests.accessTokenUser3Device1,
                HTTP_STATUSES.OK_200
            )
            const { getUsersById } = await usersTestManager.getUserById(
                userInfo.userId,
                HTTP_STATUSES.OK_200
            )
            contextTests.createdUser3 = getUsersById

            contextTests.total_number_of_active_sessions_in_tests++
            return { authData: { accessToken, refreshToken }, response }
        } else {
            return response.body
        }
    }
}