import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "../../../shared/utils/utils";
import { contextTests } from '../../../shared/__tests__/contextTests';

export const authIntegrationTest = () => {
    describe('AUTH-INTEGRATION', () => {
        it('Должен успешно зарегистрировать пользователя и отправить письмо с активацией', async () => {
            contextTests.mailService.sendMail = jest.fn((from, to, subject, text, html) => {
                return Promise.resolve(true)
            })
            const response = await contextTests.authServices.registrationServices(
                contextTests.correctUserName2,
                contextTests.correctUserPassword2,
                contextTests.correctUserEmail2
            );
            expect(response).toHaveProperty('insertedId')
            expect(contextTests.mailService.sendMail).toHaveBeenCalledWith(
                expect.any(String),
                contextTests.correctUserEmail2,
                expect.stringContaining('Активация аккаунта'),
                expect.any(String),
                expect.stringContaining('href="http://localhost:5006/auth/confirm-email'),
            );
            expect(response).not.toBeNull();
            if (response.acknowledged === true) {
                contextTests.createdUser2 = true
            }
        });
        it('Должен успешно создать access-token', async () => {
            const tokens = await contextTests.tokenService.generateTokens(
                contextTests.payload,
                contextTests.randomId as string
            );
            contextTests.accessTokenUser2Device1 = tokens.accessToken;
            expect(contextTests.accessTokenUser2Device1).toBeDefined();
            expect(typeof contextTests.accessTokenUser2Device1).toBe('string');
        });
        it('Должен успешно создать refresh-token', async () => {
            const tokens = await contextTests.tokenService.generateTokens(
                contextTests.payload,
                contextTests.randomId as string
            );
            contextTests.refreshTokenUser1Device1 = tokens.refreshToken;
            expect(contextTests.refreshTokenUser1Device1).toBeDefined();
            expect(typeof contextTests.refreshTokenUser1Device1).toBe('string');
        });
        it('Должен успешно валидировать access-token', async () => {
            const decoded = await contextTests.tokenService.validateRefreshToken(
                `Bearer ${contextTests.accessTokenUser1Device1}`
            );
            expect(decoded).toBeDefined();
        });
        it('Должен успешно валидировать refresh-token', async () => {
            const decoded = await contextTests.tokenService.validateRefreshToken(
                contextTests.refreshTokenUser1Device1
            );
            expect(decoded).toBeDefined();
        });
        it('Должен выбрасывать ошибку при неверном refresh-token', async () => {
            const decoded = await contextTests.tokenService.validateRefreshToken(contextTests.invalidToken);
            expect(decoded).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT);
        });
        it('Должен выбрасывать ошибку при неверном access-token', async () => {
            const decoded = await contextTests.tokenService.validateAccessToken(contextTests.invalidToken!);
            expect(decoded).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
        });
    });
}
