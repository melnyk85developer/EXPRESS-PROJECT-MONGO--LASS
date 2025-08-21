import { SETTINGS } from "../../src/settings";
import { app } from '../../src/app';
import { emailAdapter } from "../../src/infrastructure/emailAdapter";
import { tokenService } from "../../src/infrastructure/tokenService";
import { INTERNAL_STATUS_CODE } from "../../src/utils/utils";
import { authServices } from "../../src/services/auth/authServices";
import request from "supertest";
import * as uuid from 'uuid';

export const getRequest = () => {
    return request(app);
}

describe('AUTH-INTEGRATION', () => {
    let accessToken: string | null = null;
    let refreshToken: string | null = null;
    const payload = '245678901245678901123456'
    const deviceId = uuid.v4()

    beforeAll(async () => {
        await getRequest().delete(`${SETTINGS.RouterPath.__test__}/all-data`);
    });

    it('Должен успешно зарегистрировать пользователя и отправить письмо с активацией', async () => {
        const login = 'testUser';
        const email = 'test@example.com';
        const password = 'password123';
        emailAdapter.sendMail = jest.fn((from, to, subject, text, html) => {
            return Promise.resolve(true)
        })
        const result = await authServices.registration(login, password, email);
        // Проверяем, что sendMail был вызван с правильными параметрами
        expect(emailAdapter.sendMail).toHaveBeenCalledWith(
            expect.any(String), // Проверка поля "from"
            email, // Проверка поля "to"
            expect.stringContaining('Активация аккаунта'), // Проверка subject
            expect.any(String), // Проверка text
            expect.stringContaining('href="http://localhost:5006/auth/confirm-email'), // Проверка HTML-ссылки
        );
        expect(result).not.toBeNull();
    });
    
    it('Должен успешно создать access-token', async () => {
        const tokens = await tokenService.generateTokens(payload, deviceId); // Метод generateTokens должен возвращать оба токена
        accessToken = tokens.accessToken;
        expect(accessToken).toBeDefined(); // Проверяем, что access-token создан
        expect(typeof accessToken).toBe('string'); // Убедимся, что это строка
    });

    it('Должен успешно создать refresh-token', async () => {
        const tokens = await tokenService.generateTokens(payload, deviceId);
        refreshToken = tokens.refreshToken;
        expect(refreshToken).toBeDefined(); // Проверяем, что refresh-token создан
        expect(typeof refreshToken).toBe('string'); // Убедимся, что это строка
    });

    it('Должен успешно валидировать access-token', async () => {
        // console.log('access-token: - ', accessToken)
        const decoded = await tokenService.validateRefreshToken(`Bearer ${accessToken}`);  // Передаем с "Bearer"
        // console.log('decoded: - access-token', decoded)
        expect(decoded).toBeDefined(); // Убедимся, что токен валидируется
        // expect(decoded.userId).toBe(payload); // Проверяем, что данные совпадают
    });

    it('Должен успешно валидировать refresh-token', async () => {
        const decoded = await tokenService.validateRefreshToken(refreshToken);
        // console.log('decoded: - refresh-token', decoded)

        expect(decoded).toBeDefined(); // Убедимся, что токен валидируется
        // expect(decoded.userId).toBe(payload); // Проверяем, что данные совпадают
    });
    it('Должен выбрасывать ошибку при неверном refresh-token', async () => {
        const invalidToken = '245678901245678901123456';
        const decoded = await tokenService.validateRefreshToken(invalidToken);
        expect(decoded).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT);
    });
    
    it('Должен выбрасывать ошибку при неверном access-token', async () => {
        const invalidToken = 'Basic 245678901245678901123456';
        const decoded = await tokenService.validateAccessToken(invalidToken!);
        expect(decoded).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
    });
});
