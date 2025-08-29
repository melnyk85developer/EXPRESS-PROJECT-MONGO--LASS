import 'reflect-metadata';
// import { container } from "../../src/shared/container/iocRoot";
import { AuthServices } from "../authServices";
import { TokenService } from "../../../shared/infrastructure/tokenService";
// import { MongoDBCollection } from '../../src/db';
// import { authServices, tokenService } from "../../src/shared/container/compositionRootCustom";
import request from "supertest";

import { SETTINGS } from "../../../shared/settings";
import { app } from '../../../app';
import { INTERNAL_STATUS_CODE } from "../../../shared/utils/utils";
import { authServices, mailService, tokenService } from "../../../shared/container/compositionRootCustom";
import { contextTests } from '../../../shared/__tests__/contextTests';

// const mongoDB: MongoDBCollection = container.resolve(MongoDBCollection)
// const authServices: AuthServices = container.resolve(AuthServices)
// const tokenService: TokenService = container.resolve(TokenService)
// const mongoDB: MongoDBCollection = container.get(MongoDBCollection)

// const authServices: AuthServices = container.get(AuthServices)
// const tokenService: TokenService = container.get(TokenService)

export const getRequest = () => {
    return request(app);
}

export const authIntegrationTest = () => {
    describe('AUTH-INTEGRATION', () => {
        beforeAll(async () => {
            await getRequest().delete(`${SETTINGS.RouterPath.__test__}/all-data`);
        });

        it('Должен успешно зарегистрировать пользователя и отправить письмо с активацией', async () => {
            const login = contextTests.correctUserName1;
            const email = contextTests.correctUserEmail1;
            const password = contextTests.correctUserPassword1;
            mailService.sendMail = jest.fn((from, to, subject, text, html) => {
                return Promise.resolve(true)
            })
            const result = await authServices.registrationServices(login, password, email);

            expect(mailService.sendMail).toHaveBeenCalledWith(
                expect.any(String),
                email,
                expect.stringContaining('Активация аккаунта'),
                expect.any(String),
                expect.stringContaining('href="http://localhost:5006/auth/confirm-email'),
            );
            expect(result).not.toBeNull();
        });
        it('Должен успешно создать access-token', async () => {
            const tokens = await tokenService.generateTokens(
                contextTests.payload, 
                contextTests.randomId as string
            );
            contextTests.accessTokenUser1Device1 = tokens.accessToken;
            expect(contextTests.accessTokenUser1Device1).toBeDefined();
            expect(typeof contextTests.accessTokenUser1Device1).toBe('string');
        });
        it('Должен успешно создать refresh-token', async () => {
            const tokens = await tokenService.generateTokens(
                contextTests.payload, 
                contextTests.randomId as string
            );
            contextTests.refreshTokenUser1Device1 = tokens.refreshToken;
            expect(contextTests.refreshTokenUser1Device1).toBeDefined();
            expect(typeof contextTests.refreshTokenUser1Device1).toBe('string');
        });
        it('Должен успешно валидировать access-token', async () => {
            const decoded = await tokenService.validateRefreshToken(
                `Bearer ${contextTests.accessTokenUser1Device1}`
            );
            expect(decoded).toBeDefined();
        });
        it('Должен успешно валидировать refresh-token', async () => {
            const decoded = await tokenService.validateRefreshToken(
                contextTests.refreshTokenUser1Device1
            );
            expect(decoded).toBeDefined();
        });
        it('Должен выбрасывать ошибку при неверном refresh-token', async () => {
            const decoded = await tokenService.validateRefreshToken(contextTests.invalidToken);
            expect(decoded).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT);
        });
        it('Должен выбрасывать ошибку при неверном access-token', async () => {
            const decoded = await tokenService.validateAccessToken(contextTests.invalidToken!);
            expect(decoded).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
        });
    });
}
