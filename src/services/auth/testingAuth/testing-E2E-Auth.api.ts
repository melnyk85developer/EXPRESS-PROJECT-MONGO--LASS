import { HTTP_STATUSES } from '../../../shared/utils/utils';
import { authTestManager } from '../../../shared/__tests__/managersTests/authTestManager';
import { contextTests } from '../../../shared/__tests__/contextTests';
import { AuthServices } from '../authServices';
import { container } from '../../../shared/container/iocRoot';
import { MailService } from '../../../shared/infrastructure/emailAdapter';
import { delay } from '../../usersSessions/testingUserSessions/testing-E2E-UserSessions.api';

const authServices: AuthServices = container.get(AuthServices)
const mailService: MailService = container.get(MailService)

export const authE2eTest = () => {
    describe('E2E-AUTH', () => {
        it('Должен возвращать 204 при успешной регистрации!', async () => {
            const login = contextTests.correctUserName1;
            const email = contextTests.correctUserEmail1;
            const password = contextTests.correctUserPassword1;
            mailService.sendMail = jest.fn((from, to, subject, text, html) => {
                return Promise.resolve(true)
            })
            const response = await authServices.registrationServices(login, password, email);
            expect(response).toHaveProperty('insertedId')
            expect(mailService.sendMail).toHaveBeenCalledWith(
                expect.any(String),
                email,
                expect.stringContaining('Активация аккаунта'),
                expect.any(String),
                expect.stringContaining('href="http://localhost:5006/auth/confirm-email'),
            );
            expect(response).not.toBeNull();
        })
        it('Должен возвращать 200 при успешной авторизации!', async () => {
            const userData: any = {
                login: contextTests.correctUserName1,
                password: contextTests.correctUserPassword1,
                email: contextTests.correctUserEmail1,
            }
            const authData = {
                loginOrEmail: userData.login,
                password: userData.password
            }
            const { accessToken, refreshToken } = await authTestManager.login(
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
        })
        it('Должен возвращать 200 и информацию о пользователе!', async () => {
            await authTestManager.getUserInfo(
                contextTests.accessTokenUser1Device1, 
                HTTP_STATUSES.OK_200
            )
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
            const userData: any = {
                login: contextTests.correctUserName1,
                password: contextTests.correctUserPassword1,
                email: contextTests.correctUserEmail1,
            }

            const authData = { loginOrEmail: userData.login, password: userData.password }
            const { accessToken, refreshToken } = await authTestManager.login(
                authData,
                contextTests.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            contextTests.accessTokenUser1Device2 = accessToken
            contextTests.refreshTokenUser1Device2 = refreshToken
            expect(contextTests.accessTokenUser1Device2).toBeDefined()
            expect(typeof contextTests.accessTokenUser1Device2).toBe('string')
            expect(contextTests.refreshTokenUser1Device2).toBeDefined()
            expect(typeof contextTests.refreshTokenUser1Device2).toBe('string')

            await authTestManager.logout(
                contextTests.accessTokenUser1Device2,
                contextTests.refreshTokenUser1Device2,
                HTTP_STATUSES.NO_CONTENT_204
            )

            const { response } = await authTestManager.refreshToken(
                contextTests.accessTokenUser1Device2,
                contextTests.refreshTokenUser1Device2,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            // console.log('TEST response: - ', response.body)
            expect(response.body[0].message).toBe('Онулирован refresh-token!')
        })
    })
}