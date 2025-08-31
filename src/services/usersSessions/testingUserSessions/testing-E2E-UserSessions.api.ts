import { JwtPayload } from "jsonwebtoken";
import { SETTINGS } from "../../../shared/settings";
import { SessionType } from "../Sessions_DTO/sessionsType";
import { CreateUserModel } from "../../users/Users_DTO/CreateUserModel";
import { HTTP_STATUSES } from "../../../shared/utils/utils";
import { getRequest } from "./testing-INTEGRATION-UsersSessions.api";
import { usersTestManager } from "../../../shared/__tests__/managersTests/usersTestManager";
import { authTestManager } from "../../../shared/__tests__/managersTests/authTestManager";
import { usersSessionTestManager } from "../../../shared/__tests__/managersTests/userSessionTestManager";
import { contextTests } from "../../../shared/__tests__/contextTests";
import { container } from "../../../shared/container/iocRoot";
import { TokenService } from "../../../shared/infrastructure/tokenService";
import { SecurityDeviceServices } from "../securityDeviceService";

const tokenService: TokenService = container.get(TokenService)
const securityDeviceServices: SecurityDeviceServices = container.get(SecurityDeviceServices)

export const delay = (milliseconds: number) => new Promise((resolve) => {
    return setTimeout(() => resolve(true), milliseconds);
});
export const usersSessionsE2eTest = () => {
    describe('E2E-USERS-SESSIONS', () => {
        beforeAll(async () => {
            await getRequest().delete(`${SETTINGS.RouterPath.__test__}/all-data`)
            const userData1: CreateUserModel = {
                login: contextTests.correctUserName1,
                password: contextTests.correctUserPassword1,
                email: contextTests.correctUserEmail1
            }
            const { response } = await usersTestManager.createUser(
                userData1,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdUser1 = response
            const userData2: CreateUserModel = {
                login: contextTests.correctUserName2,
                password: contextTests.correctUserPassword2,
                email: contextTests.correctUserEmail2
            }
            const { createdEntity } = await usersTestManager.createUser(
                userData2,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdUser2 = createdEntity
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
                    const userToken = await tokenService.validateRefreshToken(contextTests.refreshTokenUser1Device1);
                    const foundDevice = await securityDeviceServices._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
                    contextTests.session1User1 = foundDevice
                } else if (i === 1) {
                    contextTests.accessTokenUser1Device2 = accessToken,
                    contextTests.refreshTokenUser1Device2 = refreshToken
                    const userToken = await tokenService.validateRefreshToken(contextTests.refreshTokenUser1Device2);
                    const foundDevice = await securityDeviceServices._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
                    contextTests.session2User1 = foundDevice
                } else if (i === 2) {
                    contextTests.accessTokenUser1Device3 = accessToken,
                    contextTests.refreshTokenUser1Device3 = refreshToken
                    const userToken = await tokenService.validateRefreshToken(contextTests.refreshTokenUser1Device3);
                    const foundDevice = await securityDeviceServices._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
                    contextTests.session3User1 = foundDevice
                } else if (i === 3) {
                    contextTests.accessTokenUser1Device4 = accessToken,
                    contextTests.refreshTokenUser1Device4 = refreshToken
                    const userToken = await tokenService.validateRefreshToken(contextTests.refreshTokenUser1Device4);
                    const foundDevice = await securityDeviceServices._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
                    contextTests.session4User1 = foundDevice
                }
            }
            const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(arrSessions.length).toBe(countSession)
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
        })
        it(`Должен удалить все сессии пользователя!`, async () => {
            await usersSessionTestManager.deleteUserSessions(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(arrSessions.length).toBe(1)
        })
        it.skip('Должен обновлять жизнь сессии при любых запросах на индпоинты!', async () => {
            const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST - getAllUserSession', getAllUserSession)
        })
        // it(`Не стоит обновлять несуществующего пользователя - You should not update a user that does not exist`, async () => {
        //     const data = {
        //         login: 'no-user-login',
        //         password: 'no-user-password',
        //         email: 'no-user-email'
        //     }
        //     await usersTestManager.updateUser('66b9413d36f75d0b44ad1c5a', data, 
        //         // authToken1,
        //         codedAuth, 
        //         HTTP_STATUSES.NOT_FOUND_404)

        // })
        // it(`Необходимо обновить пользователя с правильными исходными данными - should update user with correct input data`, async () => {
        //     const data: any = {
        //         login: 'loginUPD',
        //         password: 'update_password',
        //         email: 'update_mail@mail.ru'
        //     }
        //     await usersTestManager.updateUser(createdUser1.id, data, 
        //         // authToken1,
        //         codedAuth, 
        //         HTTP_STATUSES.NO_CONTENT_204)

        //     const {getUsersById} = await usersTestManager.getUserById(createdUser1.id, HTTP_STATUSES.OK_200)
        //     expect(getUsersById).toEqual(
        //         expect.objectContaining({
        //             login: data.login,
        //             email: data.email
        //         }))
        //     const {response} = await usersTestManager.getUserById(createdUser2.id, HTTP_STATUSES.OK_200)
        //     expect(response.body)
        //         .toEqual(expect.objectContaining(createdUser2))
        // })
        afterAll(done => {
            done()
        })
    })
}