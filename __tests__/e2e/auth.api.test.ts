import 'reflect-metadata';
import { SETTINGS } from "../../src/shared/settings";
import { authTestManager } from "./utils/authTestManager";
import { getRequest } from "./utils/blogsTestManager";
import { emailAdapter } from "../../src/shared/infrastructure/emailAdapter";
import { HTTP_STATUSES } from "../../src/shared/utils/utils";
// import { container } from "../../src/shared/container/iocRoot";
import { AuthServices } from "../../src/services/auth/authServices";
// import { MongoDBCollection } from '../../src/db';
import { authServices } from "../../src/shared/container/compositionRootCustom";

// const mongoDB: MongoDBCollection = container.resolve(MongoDBCollection)
// const authServices: AuthServices = container.resolve(AuthServices)
// const mongoDB: MongoDBCollection = container.get(MongoDBCollection)


// const authServices: AuthServices = container.get(AuthServices)

export const delay = (milliseconds: number) =>
    new Promise((resolve) => {
        return setTimeout(() => resolve(true), milliseconds);
    });

describe('test for /auth', () => {
    let sendMailParams: any = null;
    const buff2 = Buffer.from(SETTINGS.ADMIN, 'utf8')
    const codedAuth = buff2.toString('base64')
    let createdUser: any = null
    let AccessTokens: any = null
    let AccessTokens2: any = null
    let RefreshTokens: any = null
    let RefreshTokens2: any = null

    beforeAll(async () => {
        // await mongoDB.connectDB();
        await getRequest().delete(`${SETTINGS.RouterPath.__test__}/all-data`);
    })
    it('Должен возвращать 204 при успешной регистрации!', async () => {
        const login = 'MASIKUS';
        const email = 'melnyk85developer@gmail.com';
        const password = 'masikus';
        emailAdapter.sendMail = jest.fn((from, to, subject, text, html) => {
            return Promise.resolve(true)
        })
        const response = await authServices.registrationServices(login, password, email);
        expect(response).toHaveProperty('insertedId')
        expect(emailAdapter.sendMail).toHaveBeenCalledWith(
            expect.any(String), // Проверка поля "from"
            email, // Проверка поля "to"
            expect.stringContaining('Активация аккаунта'), // Проверка subject
            expect.any(String), // Проверка text
            expect.stringContaining('href="http://localhost:5006/auth/confirm-email'), // Проверка HTML-ссылки
        );
        expect(response).not.toBeNull();
    })
    it('Должен возвращать 200 при успешной авторизации!', async () => {
        const userData: any = {
            login: 'MASIKUS',
            password: 'masikus',
            email: 'melnyk85developer@gmail.com',
        }
        const authData = {
            loginOrEmail: userData.login,
            password: userData.password
        }
        const { accessToken, refreshToken } = await authTestManager.login(
            authData,
            `user-agent/auth`,
            HTTP_STATUSES.OK_200
        )
        AccessTokens = accessToken
        expect(accessToken).toBeDefined()
        expect(typeof accessToken).toBe('string')
        RefreshTokens = refreshToken
        expect(refreshToken).toBeDefined()
        expect(typeof refreshToken).toBe('string')
    })
    it('Должен возвращать 200 и информацию о пользователе!', async () => {
        await authTestManager.getUserInfo(AccessTokens, HTTP_STATUSES.OK_200)
    })
    it('Должен возвращать 200, выдавать новую пару access и refresh tokens при посещении refresh-token, а так же заносить старый refreshToken в черный список!', async () => {
        const { response, refresh } = await authTestManager.refreshToken(
            AccessTokens,
            RefreshTokens,
            HTTP_STATUSES.OK_200
        )
        AccessTokens = response.body.accessToken
        expect(response.body.accessToken).toBeDefined()
        expect(typeof response.body.accessToken).toBe('string')
        RefreshTokens = refresh
        expect(RefreshTokens).toBeDefined()
        expect(typeof RefreshTokens).toBe('string')
    })
    it('Должен возвращать при logout 204 и заносить в черный список refreshToken!', async () => {
        await delay(2000)
        const userData: any = {
            login: 'MASIKUS',
            password: 'masikus',
            email: 'melnyk85developer@gmail.com',
        }

        const authData = { loginOrEmail: userData.login, password: userData.password }
        const { accessToken, refreshToken } = await authTestManager.login(
            authData,
            `user-agent/auth`,
            HTTP_STATUSES.OK_200
        )
        AccessTokens2 = accessToken
        RefreshTokens2 = refreshToken
        expect(AccessTokens2).toBeDefined()
        expect(typeof AccessTokens2).toBe('string')
        expect(RefreshTokens2).toBeDefined()
        expect(typeof RefreshTokens2).toBe('string')

        await authTestManager.logout(
            AccessTokens2,
            RefreshTokens2,
            HTTP_STATUSES.NO_CONTENT_204
        )

        const { response } = await authTestManager.refreshToken(
            AccessTokens2,
            RefreshTokens2,
            HTTP_STATUSES.UNAUTHORIZED_401
        )
        // console.log('TEST response: - ', response.body)
        expect(response.body[0].message).toBe('Онулирован refresh-token!')
    })
    afterAll(done => {
        done()
    })
})