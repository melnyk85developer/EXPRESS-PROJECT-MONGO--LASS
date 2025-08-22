import { SETTINGS } from "../../src/settings";
import { authTestManager } from "./utils/authTestManager";
import { getRequest } from "./utils/blogsTestManager";
import { usersTestManager } from "./utils/usersTestManager";
import { usersSessionTestManager } from "./utils/userSessionTestManager";
import { JwtPayload } from "jsonwebtoken";
import { UserType } from "../../src/services/users/Users_DTO/userTypes";
import { SessionType } from "../../src/services/usersSessions/Sessions_DTO/sessionsType";
import { CreateUserModel } from "../../src/services/users/Users_DTO/CreateUserModel";
import { HTTP_STATUSES } from "../../src/shared/utils/utils";
import { tokenService } from "../../src/shared/infrastructure/tokenService";
import { securityDeviceServices } from "../../src/services/usersSessions/securityDeviceService";

export const delay = (milliseconds: number) =>
    new Promise((resolve) => {
      return setTimeout(() => resolve(true), milliseconds);
});
describe('E2E-USERS-SESSIONS', () => {
    const buff2 = Buffer.from(SETTINGS.ADMIN, 'utf8')
    const codedAuth = buff2.toString('base64')
    let params: string = ''
    let users = [] as UserType[]
    let user1: any
    let user2: any

    let accessToken1: string | null;
    let refreshToken1: string | null;
    let session1: SessionType | null;
    let accessToken2: string | null;
    let refreshToken2: string | null;
    let session2: SessionType | null;
    let accessToken3: string | null;
    let refreshToken3: string | null;
    let session3: SessionType | null;
    let accessToken4: string | null;
    let refreshToken4: string | null;
    let session4: SessionType | null;
    
    beforeAll(async () => {
        await getRequest().delete(`${SETTINGS.RouterPath.__test__}/all-data`)
        const userData1: CreateUserModel = {
            login: 'login',
            password: 'password',
            email: 'webmars@mars.com'
        }
        const { response } = await usersTestManager.createUser(
            userData1, 
            codedAuth, 
            HTTP_STATUSES.CREATED_201
        )
        user1 = response

        const userData2: CreateUserModel = {
            login: 'login2',
            password: 'password2',
            email: 'webmars2@mars.com'
        }
        const { response: user } = await usersTestManager.createUser(
            userData2, 
            codedAuth, 
            HTTP_STATUSES.CREATED_201
        )
        user2 = user
    })

    it('Должен создать жменю сессий пользователя', async () => {
        const countSession = 4;
        for(let i = 0; i < countSession; i++){
            await delay(1000)
            const { accessToken, refreshToken } = await authTestManager.login(
                {
                    loginOrEmail: 'login',
                    password: 'password'
                }, 
                `user-agent/E2E-USERS-SESSIONS.${i}`, 
                HTTP_STATUSES.OK_200
            )
            if(i === 0){
                accessToken1 = accessToken, 
                refreshToken1 = refreshToken
                const userToken = await tokenService.validateRefreshToken(refreshToken);
                const foundDevice = await securityDeviceServices._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
                // console.log('TEST: - ', foundDevice)
                session1 = foundDevice
            }else if(i === 1){
                accessToken2 = accessToken, 
                refreshToken2 = refreshToken
                const userToken = await tokenService.validateRefreshToken(refreshToken2);
                const foundDevice = await securityDeviceServices._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
                session2 = foundDevice
            }else if(i === 2){
                accessToken3 = accessToken, 
                refreshToken3 = refreshToken
                const userToken = await tokenService.validateRefreshToken(refreshToken3);
                const foundDevice = await securityDeviceServices._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
                session3 = foundDevice
            }else if(i === 3){
                accessToken4 = accessToken, 
                refreshToken4 = refreshToken
                const userToken = await tokenService.validateRefreshToken(refreshToken4);
                const foundDevice = await securityDeviceServices._getSessionByDeviceIdServices(String((userToken as JwtPayload).deviceId));
                session4 = foundDevice
            }
        }

        const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId( 
            refreshToken1!, 
            HTTP_STATUSES.OK_200
        )
        expect(arrSessions.length).toBe(countSession)  
    })
    it('Должен возвращать 403 при удалении чужой сессии пользователя!', async () => {
        const { accessToken, refreshToken } = await authTestManager.login(
            {
                loginOrEmail: 'login2',
                password: 'password2'
            }, 
            `user-agent/E2E-USERS-SESSIONS`, 
            HTTP_STATUSES.OK_200
        )
        await usersSessionTestManager.deleteSessionByDeviceId(
            session4!.deviceId, 
            refreshToken!, 
            HTTP_STATUSES.FORBIDDEN_403
        )
    })
    it('Должен возвращать 200, выдавать новую пару access и refresh tokens при посещении refresh-token, а так же заносить старый refreshToken в черный список!', async () => {
        const { arrSessions: userSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
            refreshToken1!, 
            HTTP_STATUSES.OK_200
        )
        expect(userSessions.length).toBe(4) 

        const { response, refresh } = await authTestManager.refreshToken(
            accessToken1,
            refreshToken1, 
            HTTP_STATUSES.OK_200
        )
        accessToken1 = response.body.accessToken
        refreshToken1 = refresh
        expect(accessToken1).toBeDefined()
        expect(typeof accessToken1).toBe('string')
        expect(refreshToken1).toBeDefined()
        expect(typeof refreshToken1).toBe('string')

        const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
            refreshToken1!, 
            HTTP_STATUSES.OK_200
        )
        expect(arrSessions.length).toBe(4) 
    })
    it('Должен возвращать 204 при успешном удалении сессии пользователя!', async () => {
        const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
            refreshToken1!, 
            HTTP_STATUSES.OK_200
        )
        expect(arrSessions.length).toBe(4) 

        await usersSessionTestManager.deleteSessionByDeviceId(
            session2!.deviceId,
            refreshToken1!, 
            HTTP_STATUSES.NO_CONTENT_204
        )
        const { response } = await usersSessionTestManager.getAllUserSessionByUserId(
            refreshToken1!, 
            HTTP_STATUSES.OK_200
        )
        expect(response.length).toBe(3) 
    })
    it('Должен возвращать при logout 204 и заносить в черный список refreshToken!', async () => {
        await delay(2000)
        await authTestManager.logout(
            accessToken3!, 
            refreshToken3!, 
            HTTP_STATUSES.NO_CONTENT_204
        )
        const {response} = await authTestManager.refreshToken(
            accessToken3,
            refreshToken3, 
            HTTP_STATUSES.UNAUTHORIZED_401
        )
        expect(response.body[0].message).toBe('Онулирован refresh-token!')

        const { response: sessions } = await usersSessionTestManager.getAllUserSessionByUserId(
            refreshToken1!, 
            HTTP_STATUSES.OK_200
        )
        expect(sessions.length).toBe(2) 
    })
    it(`Должен удалить все сессии пользователя!`, async () => {
        await usersSessionTestManager.deleteUserSessions(
            refreshToken1!, 
            HTTP_STATUSES.NO_CONTENT_204
        )
        const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
            refreshToken1!, 
            HTTP_STATUSES.OK_200
        )
        expect(arrSessions.length).toBe(1) 
    })
    it.skip('Должен обновлять жизнь сессии при любых запросах на индпоинты!', async () => {
        const {arrSessions} = await usersSessionTestManager.getAllUserSessionByUserId(
            refreshToken1!, 
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