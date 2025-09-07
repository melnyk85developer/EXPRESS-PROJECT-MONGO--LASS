import jwt, { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';;
import { INTERNAL_STATUS_CODE } from '../../../shared/utils/utils';
import { contextTests } from '../../../shared/__tests__/contextTests';
import { getRequest } from '../../../shared/__tests__/managersTests/authTestManager';
import { SETTINGS } from '../../../shared/settings';

export const authUnitTest = () => {
    // beforeAll(() => {
    //     jest.spyOn(MongoDBCollection.prototype, 'tokensCollection', 'get')
    //         .mockReturnValue({
    //             insertOne: jest.fn(),
    //             deleteOne: jest.fn(),
    //             findOne: jest.fn(),
    //         } as any);
    // });
    describe('UNIT-AUTH', () => {
        beforeAll(async () => {
            // contextTests.tokensCollection = mongoDBCollection.tokensCollection;
            contextTests.mongoDBCollection.tokensCollection = {
                insertOne: jest.fn(),
                deleteOne: jest.fn(),
                findOne: jest.fn(),
            } as any;
        });
        describe('generateTokens', () => {
            it('Должен выдать ошибку, если полезная нагрузка равна null или не определена', async () => {
                await expect(contextTests.tokenService.generateTokens(null, '-100')).rejects.toThrow('Payload cannot be null or undefined');
            });

            it('Должны возвращать маркеры доступа и обновления', async () => {
                // Мокаем jwt.sign и указываем возвращаемые значения
                const signMock = jest.spyOn(jwt, 'sign')
                    .mockImplementationOnce(() => 'mockAccessToken')
                    .mockImplementationOnce(() => 'mockRefreshToken');
                const result = await contextTests.tokenService.generateTokens('123', '321');
                expect(result.accessToken).toBe('mockAccessToken');
                expect(result.refreshToken).toBe('mockRefreshToken');
                expect(signMock).toHaveBeenCalledTimes(2);
            });
        });

        describe('validateAccessToken', () => {
            it('Должен возвращать statusCode, если токен недействителен', async () => {
                const mockToken = 'invalidToken';
                // Мокируем jwt.verify с возвращаемым значением null
                jwt.verify = jest.fn().mockReturnValueOnce(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
                const result = await contextTests.tokenService.validateAccessToken(mockToken);
                expect(result).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
            });

            it('Должен возвращать данные пользователя, если токен действителен', async () => {
                const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RhZGJhMGVlZWZmZTg0MGNmMTc0OTgiLCJpYXQiOjE3NDIzOTYzMjAsImV4cCI6MTc0MjM5NzIyMH0.ycNAtWhYJQdwqWH6Genek3Qh8n-mtPEkL0v317l1qWE';
                const mockUserData: JwtPayload = { userId: '67dad3dc965cc9ac98d98e1c' }; // Типизируем возвращаемое значение
                // Мокируем jwt.verify с возвращаемым значением mockUserData
                jwt.verify = jest.fn().mockReturnValueOnce(mockUserData);
                const result = await contextTests.tokenService.validateAccessToken(mockToken);
                expect(result).toEqual(mockUserData);
            });

            it('Должен возвращать статус-код, если формат токена недействителен', async () => {
                const mockToken = 'invalidFormatToken';
                const result = await contextTests.tokenService.validateAccessToken(mockToken);
                expect(result).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
            });

        });

        describe('validateRefreshToken', () => {
            it('Должен возвращать statusCode, если формат токена недействителен', async () => {
                const mockToken = 'invalidFormatToken';
                const result = await contextTests.tokenService.validateRefreshToken(mockToken);
                expect(result).toBe(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT);
            });

            it('Должен возвращать данные пользователя, если токен действителен', async () => {
                const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RhZDQ0MGIxMWFlMWRkYWM1YjNkNDkiLCJkZXZpY2VJZCI6IjI0ODE5NzFiLTFhMGItNDg5YS1hNzUwLTEzZTdkNzE4NDBjMSIsImlhdCI6MTc0MjM5NDQzMywiZXhwIjoxNzQ0OTg2NDMzfQ.IXmPr9i21eDiUzL8X-1MPoRnpnxsOVglFc01tRPXY7Q';
                const mockUserData: JwtPayload = { userId: '67dad3dc965cc9ac98d98e1c' }; // Типизируем возвращаемое значение
                jwt.verify = jest.fn().mockReturnValueOnce(mockUserData);
                const result = await contextTests.tokenService.validateRefreshToken(mockToken);
                expect(result).toEqual(mockUserData);
            });
        });

        describe('saveBlackListToken', () => {
            it('Должен вставить токен в базу данных', async () => {
                const mockUserId = '123';
                const mockRefreshToken = 'mockRefreshToken';
                // Мокируем MongoDB метод insertOne, используя типизацию
                (contextTests.mongoDBCollection.tokensCollection.insertOne as jest.Mock).mockResolvedValueOnce({ insertedId: new ObjectId() });
                const result = await contextTests.tokenService.saveRefreshTokenBlackList(mockUserId, mockRefreshToken);
                expect(result).toEqual({ insertedId: expect.any(ObjectId) });
                expect(contextTests.mongoDBCollection.tokensCollection.insertOne).toHaveBeenCalledWith({ userId: mockUserId, refreshToken: mockRefreshToken });
            });

            it('Должен возвращать объект ошибки, если произошла ошибка', async () => {
                const mockUserId = '123';
                const mockRefreshToken = 'mockRefreshToken';

                // Мокируем MongoDB метод insertOne, используя типизацию
                const mockError = INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST;
                (contextTests.mongoDBCollection.tokensCollection.insertOne as jest.Mock).mockRejectedValueOnce(mockError);

                const result = await contextTests.tokenService.saveRefreshTokenBlackList(mockUserId, mockRefreshToken);

                // Проверяем, что результат равен объекту ошибки
                expect(result).toBe(mockError);
            });

        });

        describe('removeToken', () => {
            it('Должен удалить токен из базы данных', async () => {
                const mockRefreshToken = 'mockRefreshToken';
                // Мокируем MongoDB метод deleteOne, используя типизацию
                (contextTests.mongoDBCollection.tokensCollection.deleteOne as jest.Mock).mockResolvedValueOnce({ deletedCount: 1 });
                const result = await contextTests.tokenService.deleteRefreshTokenByTokenInBlackList(mockRefreshToken);
                expect(result).toEqual({ deletedCount: 1 });
                expect(contextTests.mongoDBCollection.tokensCollection.deleteOne).toHaveBeenCalledWith({ refreshToken: mockRefreshToken });
            });
        });

        describe('findToken', () => {
            it('Должен возвращать данные о маркере из базы данных', async () => {
                const mockRefreshToken = 'mockRefreshToken';
                const mockTokenData = { userId: '123', refreshToken: mockRefreshToken };
                // Мокируем MongoDB метод findOne, используя типизацию
                (contextTests.mongoDBCollection.tokensCollection.findOne as jest.Mock).mockResolvedValueOnce(mockTokenData);
                const result = await contextTests.tokenService.getRefreshTokenByTokenInBlackList(mockRefreshToken);
                expect(result).toEqual(mockTokenData);
            });

            it('Должен возвращать null, если токен не найден', async () => {
                const mockRefreshToken = 'mockRefreshToken';
                // Мокируем MongoDB метод findOne, используя типизацию
                (contextTests.mongoDBCollection.tokensCollection.findOne as jest.Mock).mockResolvedValueOnce(null);
                const result = await contextTests.tokenService.getRefreshTokenByTokenInBlackList(mockRefreshToken);
                expect(result).toBeNull();
            });
        });
    });
}
