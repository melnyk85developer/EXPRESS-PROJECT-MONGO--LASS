import { JwtPayload } from "jsonwebtoken";
import { SETTINGS } from '../../../shared/settings';
import { HTTP_STATUSES } from '../../../shared/utils/utils';
import { CreateUserModel } from '../Users_DTO/CreateUserModel';
import { authTestManager, getRequest } from '../../../shared/__tests__/managersTests/authTestManager';
import { usersTestManager } from '../../../shared/__tests__/managersTests/usersTestManager';
import { contextTests } from '../../../shared/__tests__/contextTests';
import { isCreatedUser1 } from "./testFunctionsUser";

export const usersE2eTest = () => {
    describe('E2E-USERS', () => {
        beforeAll(async () => {
            if (contextTests.createdUser1) {
                const { response } = await usersTestManager.deleteUser(
                    contextTests.createdUser1.id,
                    contextTests.codedAuth,
                    HTTP_STATUSES.NO_CONTENT_204
                )
                if (response.status === HTTP_STATUSES.NO_CONTENT_204) {
                    contextTests.createdUser1 = null
                }
            }
            if (contextTests.createdUser2) {
                const { accessToken } = await authTestManager.login(
                    {
                        loginOrEmail: contextTests.correctUserName2,
                        password: contextTests.correctUserPassword2
                    },
                    contextTests.userAgent[0],
                    HTTP_STATUSES.OK_200
                )
                const { userInfo } = await authTestManager.getUserInfo(
                    accessToken,
                    HTTP_STATUSES.OK_200
                )
                const { getUsersById } = await usersTestManager.getUserById(
                    userInfo.userId,
                    HTTP_STATUSES.OK_200
                )
                const { response } = await usersTestManager.deleteUser(
                    getUsersById.id,
                    contextTests.codedAuth,
                    HTTP_STATUSES.NO_CONTENT_204
                )
                if (response.status === HTTP_STATUSES.NO_CONTENT_204) {
                    contextTests.createdUser2 = null
                }
            }
            if (contextTests.createdUser3) {
                const { response } = await usersTestManager.deleteUser(
                    contextTests.createdUser3.id,
                    contextTests.codedAuth,
                    HTTP_STATUSES.NO_CONTENT_204
                )
                if (response.status === HTTP_STATUSES.NO_CONTENT_204) {
                    contextTests.createdUser3 = null
                }
            }
        })
        it('Должен возвращать 200, а массив users - should return 200 and user array', async () => {
            const { getAllUsers } = await usersTestManager.getAllUsers(
                contextTests.userParams,
                HTTP_STATUSES.OK_200
            )
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
            await usersTestManager.getUserById(
                contextTests.invalidId,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`Не стоит создавать пользователя с не валидными исходными данными - You should not create a user with incorrect initial data`, async () => {
            const data: any = {
                login: '',
                password: '',
                email: ''
            }
            await usersTestManager.createUser(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getAllUsers } = await usersTestManager.getAllUsers(
                contextTests.userParams,
                HTTP_STATUSES.OK_200
            )
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
                login: contextTests.correctUserName1,
                password: contextTests.correctUserPassword1,
                email: contextTests.correctUserEmail1
            }
            const { createdEntity } = await usersTestManager.createUser(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdUser1 = createdEntity

            const authData = {
                loginOrEmail: contextTests.correctUserEmail1,
                password: contextTests.correctUserPassword1
            }
            const { accessToken, refreshToken } = await authTestManager.login(
                authData,
                contextTests.userAgent[4],
                HTTP_STATUSES.OK_200
            )
            contextTests.accessTokenUser1Device1 = accessToken
            contextTests.refreshTokenUser1Device1 = refreshToken

            const { getAllUsers } = await usersTestManager.getAllUsers(
                contextTests.userParams,
                HTTP_STATUSES.OK_200
            )
            expect(getAllUsers).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.createdUser1]
                })
            );
        })
        it(`Создать еще одного пользователя - create another user`, async () => {
            const data: any = {
                login: contextTests.correctUserName2,
                password: contextTests.correctUserPassword2,
                email: contextTests.correctUserEmail2
            }
            const { createdEntity } = await usersTestManager.createUser(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdUser2 = createdEntity
            const authData = {
                loginOrEmail: data.email,
                password: data.password
            }
            const { accessToken } = await authTestManager.login(
                authData,
                contextTests.userAgent[6],
                HTTP_STATUSES.OK_200
            )
            contextTests.accessTokenUser2Device1 = accessToken
            const { getAllUsers } = await usersTestManager.getAllUsers(
                contextTests.userParams,
                HTTP_STATUSES.OK_200
            )
            expect(getAllUsers).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.createdUser1, contextTests.createdUser2]
                })
            )
        })
        it(`Не следует обновлять пользователя с невалидными данными - You should not update a user with incorrect user data`, async () => {
            const data: any = {
                login: '',
                password: '',
                email: ''
            }
            await usersTestManager.updateUser(
                contextTests.createdUser1.id,
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getUsersById } = await usersTestManager.getUserById(
                contextTests.createdUser1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getUsersById).toEqual(
                expect.objectContaining(
                    contextTests.createdUser1
                )
            )
        })
        it(`Не стоит обновлять несуществующего пользователя - You should not update a user that does not exist`, async () => {
            const data = {
                login: contextTests.correctUserName3,
                password: contextTests.correctUserPassword3,
                email: contextTests.correctUserEmail3
            }
            await usersTestManager.updateUser(
                contextTests.invalidId,
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`Необходимо обновить пользователя с правильными исходными данными - should update user with correct input data`, async () => {
            const data: any = {
                login: contextTests.correctUserName2,
                password: contextTests.correctUserPassword2,
                email: contextTests.correctUserEmail2
            }
            await usersTestManager.updateUser(
                contextTests.createdUser1.id,
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getUsersById } = await usersTestManager.getUserById(
                contextTests.createdUser1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getUsersById).toEqual(
                expect.objectContaining({
                    login: data.login,
                    email: data.email
                }))
            const { response } = await usersTestManager.getUserById(
                contextTests.createdUser2.id,
                HTTP_STATUSES.OK_200
            )
            expect(response.body)
                .toEqual(expect.objectContaining(
                    contextTests.createdUser2
                )
                )
        })
        it(`Должен удалить оба пользователя - should delete both user`, async () => {
            await usersTestManager.deleteUser(
                contextTests.createdUser1.id,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            await usersTestManager.getUserById(
                contextTests.createdUser1.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            await usersTestManager.deleteUser(
                contextTests.createdUser2.id,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            await usersTestManager.getUserById(
                contextTests.createdUser2.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getAllUsers } = await usersTestManager.getAllUsers(
                contextTests.userParams,
                HTTP_STATUSES.OK_200
            )
            expect(getAllUsers).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
        })
    })
}