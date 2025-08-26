import 'reflect-metadata';
// import { container } from "../../src/shared/container/iocRoot";
// import { MongoDBCollection } from '../../src/db';
import { TokenService } from "../../src/shared/infrastructure/tokenService";
// import { tokenService, securityDeviceServices } from "../../src/shared/container/compositionRootCustom";
import { JwtPayload } from "jsonwebtoken";
import { SETTINGS } from "../../src/shared/settings";
import { authTestManager } from "./utils/authTestManager";
import { getRequest } from "./utils/blogsTestManager";
import { usersTestManager } from "./utils/usersTestManager";
import { CreateUserModel } from "../../src/services/users/Users_DTO/CreateUserModel";
import { HTTP_STATUSES } from "../../src/shared/utils/utils";

import { tokenService } from "../../src/shared/container/compositionRootCustom";

// const mongoDB: MongoDBCollection = container.resolve(MongoDBCollection)
// const tokenService: TokenService = container.resolve(TokenService)
// const mongoDB: MongoDBCollection = container.get(MongoDBCollection)

// const tokenService: TokenService = container.get(TokenService)

describe('test for /users', () => {
    const buff2 = Buffer.from(SETTINGS.ADMIN, 'utf8')
    const codedAuth = buff2.toString('base64')

    let cookies: string[] = [];
    let createdUser1: any = null
    let createdUser2: any = null
    let AccessToken: any = null
    let RefreshToken: any = null
    let authToken1: any = null
    let authToken2: any = null
    let params: string = ''
    beforeAll(async () => {
        // await mongoDB.connectDB();
        await getRequest().delete(`${SETTINGS.RouterPath.__test__}/all-data`)
    })
    it('Должен возвращать 200, а массив постов - should return 200 and user array', async () => {
        const { getAllUsers } = await usersTestManager.getAllUsers(params, HTTP_STATUSES.OK_200)
        expect(getAllUsers).toEqual(
            expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }))
    })
    it('Должен возвращать 404 для несуществующего пользователя - should return 404 for a non-existent user', async () => {
        await usersTestManager.getUserById('66b9413d36f75d0b44ad1c5a', HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`Не стоит создавать пользователя с не валидными исходными данными - You should not create a user with incorrect initial data`, async () => {
        const data: any = {
            login: '',
            password: '',
            email: ''
        }
        await usersTestManager.createUser(data, codedAuth, HTTP_STATUSES.BAD_REQUEST_400)
        const { getAllUsers } = await usersTestManager.getAllUsers(params, HTTP_STATUSES.OK_200)
        expect(getAllUsers).toEqual(
            expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }))
    })
    it(`Необходимо создать пользователя с правильными исходными данными - it is necessary to create a user with the correct initial data`, async () => {
        const data: CreateUserModel = {
            login: 'login',
            password: 'password',
            email: 'webmars@mars.com'
        }
        await usersTestManager.createUser(data, codedAuth, HTTP_STATUSES.CREATED_201)

        const authData = {
            loginOrEmail: data.email,
            password: data.password
        }
        const { accessToken, refreshToken } = await authTestManager.login(authData, `user-agent/users`, HTTP_STATUSES.OK_200)
        AccessToken = accessToken
        RefreshToken = refreshToken
        const user = await tokenService.validateAccessToken(accessToken) as JwtPayload;

        const { getUsersById } = await usersTestManager.getUserById(user!.userId, HTTP_STATUSES.OK_200)
        // console.log('getUsersById: - ', getUsersById)

        createdUser1 = getUsersById;
        authToken1 = accessToken
        const { getAllUsers } = await usersTestManager.getAllUsers(params, HTTP_STATUSES.OK_200)
        expect(getAllUsers).toEqual(
            expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [createdUser1]
            })
        );

    })
    it(`Создать еще одного пользователя - create another user`, async () => {
        const data: any = {
            login: 'login2--',
            password: 'password2--',
            email: 'webmars2@mars.com'
        }
        await usersTestManager.createUser(data, codedAuth, HTTP_STATUSES.CREATED_201)

        const authData = {
            loginOrEmail: data.email,
            password: data.password
        }
        const { accessToken } = await authTestManager.login(authData, `user-agent/users`, HTTP_STATUSES.OK_200)
        const user = await tokenService.validateAccessToken(accessToken) as JwtPayload;
        const { getUsersById } = await usersTestManager.getUserById(user!.userId, HTTP_STATUSES.OK_200)
        // console.log('getUsersById: - TEST', getUsersById)

        authToken2 = accessToken
        createdUser2 = getUsersById;

        const { getAllUsers } = await usersTestManager.getAllUsers(params, HTTP_STATUSES.OK_200)
        // console.log('getAllUsers: - TEST', getAllUsers)
        expect(getAllUsers).toEqual(
            expect.objectContaining({
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [createdUser1, createdUser2]
            }))
    })
    it(`Не следует обновлять пользователя с невалидными данными - You should not update a user with incorrect user data`, async () => {
        const data: any = {
            login: '',
            password: '',
            email: ''
        }
        await usersTestManager.updateUser(createdUser1.id, data,
            // authToken1,
            codedAuth,

            HTTP_STATUSES.BAD_REQUEST_400)
        const { getUsersById } = await usersTestManager.getUserById(createdUser1.id, HTTP_STATUSES.OK_200)
        expect(getUsersById).toEqual(expect.objectContaining(createdUser1))
    })
    it(`Не стоит обновлять несуществующего пользователя - You should not update a user that does not exist`, async () => {
        const data = {
            login: 'no-user-login',
            password: 'no-user-password',
            email: 'no-user-email'
        }
        await usersTestManager.updateUser('66b9413d36f75d0b44ad1c5a', data,
            // authToken1,
            codedAuth,
            HTTP_STATUSES.NOT_FOUND_404)

    })
    it(`Необходимо обновить пользователя с правильными исходными данными - should update user with correct input data`, async () => {
        const data: any = {
            login: 'loginUPD',
            password: 'update_password',
            email: 'update_mail@mail.ru'
        }
        await usersTestManager.updateUser(createdUser1.id, data,
            // authToken1,
            codedAuth,
            HTTP_STATUSES.NO_CONTENT_204)

        const { getUsersById } = await usersTestManager.getUserById(createdUser1.id, HTTP_STATUSES.OK_200)
        expect(getUsersById).toEqual(
            expect.objectContaining({
                login: data.login,
                email: data.email
            }))
        const { response } = await usersTestManager.getUserById(createdUser2.id, HTTP_STATUSES.OK_200)
        expect(response.body)
            .toEqual(expect.objectContaining(createdUser2))
    })
    it(`Должен удалить оба пользователя - should delete both user`, async () => {
        await usersTestManager.deleteUser(createdUser1.id,
            // authToken1, 
            codedAuth,
            HTTP_STATUSES.NO_CONTENT_204)
        await usersTestManager.getUserById(createdUser1.id, HTTP_STATUSES.NOT_FOUND_404)
        await usersTestManager.deleteUser(createdUser2.id,
            // authToken2, 
            codedAuth,
            HTTP_STATUSES.NO_CONTENT_204)
        await usersTestManager.getUserById(createdUser2.id, HTTP_STATUSES.NOT_FOUND_404)
        const { getAllUsers } = await usersTestManager.getAllUsers(params, HTTP_STATUSES.OK_200)
        expect(getAllUsers).toEqual(
            expect.objectContaining({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            }))
    })
    afterAll(done => {
        done()
    })
})
// .set('Cookie', cookies ? cookies : []) // Устанавливаем куку, если она есть