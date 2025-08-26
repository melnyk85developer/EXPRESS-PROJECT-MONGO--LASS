import 'reflect-metadata';
import request from "supertest";
import { SETTINGS } from "../../src/shared/settings";
import { app } from '../../src/app';
import { usersSessionTestManager } from "../e2e/utils/userSessionTestManager";
import { usersTestManager } from "../e2e/utils/usersTestManager";
import { authTestManager } from "../e2e/utils/authTestManager";
import { UserType } from "../../src/services/users/Users_DTO/userTypes";
import { CreateUserModel } from "../../src/services/users/Users_DTO/CreateUserModel";
import { HTTP_STATUSES } from "../../src/shared/utils/utils";
// import { container } from '../../src/shared/container/iocRoot';
// import { MongoDBCollection } from '../../src/db';

// const mongoDB: MongoDBCollection = container.resolve(MongoDBCollection)
// const mongoDB: MongoDBCollection = container.get(MongoDBCollection)

export const getRequest = () => {
    return request(app);
}

describe('SESSIONS-INTEGRATION-TEST', () => {
    const buff2 = Buffer.from(SETTINGS.ADMIN, 'utf8')
    const codedAuth = buff2.toString('base64')
    let params: string = ''
    let user1: any
    let users = [] as UserType[]
    let accessToken1: string | null;
    let refreshToken1: string | null;

    beforeAll(async () => {
        // await mongoDB.connectDB();
        await getRequest().delete(`${SETTINGS.RouterPath.__test__}/all-data`)
        const data: CreateUserModel = {
            login: 'login',
            password: 'password',
            email: 'webmars@mars.com'
        }
        const { response } = await usersTestManager.createUser(
            data,
            codedAuth,
            HTTP_STATUSES.CREATED_201
        )
        user1 = response
        const { accessToken, refreshToken } = await authTestManager.login(
            {
                loginOrEmail: 'login',
                password: 'password'
            },
            `user-agent/SESSIONS-INTEGRATION-TEST`,
            HTTP_STATUSES.OK_200
        )
        accessToken1 = accessToken,
            refreshToken1 = refreshToken
    })
    it('Должен успешно создать сессию!', async () => {
        const count = 5;
        await usersSessionTestManager.createArrayUsersSessions(
            count,
            codedAuth,
            refreshToken1
        );
        const { arrSessions } = await usersSessionTestManager.getAllUserSessionByUserId(
            refreshToken1!,
            HTTP_STATUSES.OK_200
        )
        expect(arrSessions.length).toBe(count + 1)

        await usersSessionTestManager.deleteUserSessions(
            refreshToken1!,
            HTTP_STATUSES.NO_CONTENT_204
        )
        const { response } = await usersSessionTestManager.getAllUserSessionByUserId(
            refreshToken1!,
            HTTP_STATUSES.OK_200
        )
        expect(response.length).toBe(1)
    })
});
