import request from "supertest";
import { SETTINGS } from "../../../shared/settings";
import { app } from '../../../app';
import { UserType } from "../../users/Users_DTO/userTypes";
import { CreateUserModel } from "../../users/Users_DTO/CreateUserModel";
import { HTTP_STATUSES } from "../../../shared/utils/utils";
import { usersTestManager } from '../../../shared/__tests__/managersTests/usersTestManager';
import { authTestManager } from '../../../shared/__tests__/managersTests/authTestManager';
import { usersSessionTestManager } from '../../../shared/__tests__/managersTests/userSessionTestManager';
import { contextTests } from '../../../shared/__tests__/contextTests';
// import { container } from '../../src/shared/container/iocRoot';
// import { MongoDBCollection } from '../../src/db';

// const mongoDB: MongoDBCollection = container.get(MongoDBCollection)

export const getRequest = () => {
    return request(app);
}
export const usersSessionsInegrationTest = () => {
    describe('SESSIONS-INTEGRATION-TEST', () => {
        beforeAll(async () => {
            // await mongoDB.connectDB();
            await getRequest().delete(`${SETTINGS.RouterPath.__test__}/all-data`)
            const data: CreateUserModel = {
                login: contextTests.correctUserName1,
                password: contextTests.correctUserPassword1,
                email: contextTests.correctUserEmail1
            }
            const { response } = await usersTestManager.createUser(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdUser1 = response
            const { accessToken, refreshToken } = await authTestManager.login(
                {
                    loginOrEmail: contextTests.correctUserName1,
                    password: contextTests.correctUserPassword1
                },
                contextTests.userAgent[6],
                HTTP_STATUSES.OK_200
            )
            contextTests.accessTokenUser1Device1 = accessToken,
            contextTests.refreshTokenUser1Device1 = refreshToken
        })
        it('Должен успешно создать сессию!', async () => {
            const count = 5;
            await usersSessionTestManager.createArrayUsersSessions(
                count,
                contextTests.codedAuth,
                contextTests.refreshTokenUser1Device1
            );
            const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(arrSessions.length).toBe(count + 1)
            await usersSessionTestManager.deleteUserSessions(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { response } = await usersSessionTestManager.getAllUserSessionByUserId(
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(response.length).toBe(1)
        })
    });
}
