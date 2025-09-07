"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUnitTest = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongodb_1 = require("mongodb");
;
const utils_1 = require("../../../shared/utils/utils");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
const authUnitTest = () => {
    // beforeAll(() => {
    //     jest.spyOn(MongoDBCollection.prototype, 'tokensCollection', 'get')
    //         .mockReturnValue({
    //             insertOne: jest.fn(),
    //             deleteOne: jest.fn(),
    //             findOne: jest.fn(),
    //         } as any);
    // });
    describe('UNIT-AUTH', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            // contextTests.tokensCollection = mongoDBCollection.tokensCollection;
            contextTests_1.contextTests.mongoDBCollection.tokensCollection = {
                insertOne: jest.fn(),
                deleteOne: jest.fn(),
                findOne: jest.fn(),
            };
        }));
        describe('generateTokens', () => {
            it('Должен выдать ошибку, если полезная нагрузка равна null или не определена', () => __awaiter(void 0, void 0, void 0, function* () {
                yield expect(contextTests_1.contextTests.tokenService.generateTokens(null, '-100')).rejects.toThrow('Payload cannot be null or undefined');
            }));
            it('Должны возвращать маркеры доступа и обновления', () => __awaiter(void 0, void 0, void 0, function* () {
                // Мокаем jwt.sign и указываем возвращаемые значения
                const signMock = jest.spyOn(jsonwebtoken_1.default, 'sign')
                    .mockImplementationOnce(() => 'mockAccessToken')
                    .mockImplementationOnce(() => 'mockRefreshToken');
                const result = yield contextTests_1.contextTests.tokenService.generateTokens('123', '321');
                expect(result.accessToken).toBe('mockAccessToken');
                expect(result.refreshToken).toBe('mockRefreshToken');
                expect(signMock).toHaveBeenCalledTimes(2);
            }));
        });
        describe('validateAccessToken', () => {
            it('Должен возвращать statusCode, если токен недействителен', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockToken = 'invalidToken';
                // Мокируем jwt.verify с возвращаемым значением null
                jsonwebtoken_1.default.verify = jest.fn().mockReturnValueOnce(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
                const result = yield contextTests_1.contextTests.tokenService.validateAccessToken(mockToken);
                expect(result).toBe(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
            }));
            it('Должен возвращать данные пользователя, если токен действителен', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RhZGJhMGVlZWZmZTg0MGNmMTc0OTgiLCJpYXQiOjE3NDIzOTYzMjAsImV4cCI6MTc0MjM5NzIyMH0.ycNAtWhYJQdwqWH6Genek3Qh8n-mtPEkL0v317l1qWE';
                const mockUserData = { userId: '67dad3dc965cc9ac98d98e1c' }; // Типизируем возвращаемое значение
                // Мокируем jwt.verify с возвращаемым значением mockUserData
                jsonwebtoken_1.default.verify = jest.fn().mockReturnValueOnce(mockUserData);
                const result = yield contextTests_1.contextTests.tokenService.validateAccessToken(mockToken);
                expect(result).toEqual(mockUserData);
            }));
            it('Должен возвращать статус-код, если формат токена недействителен', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockToken = 'invalidFormatToken';
                const result = yield contextTests_1.contextTests.tokenService.validateAccessToken(mockToken);
                expect(result).toBe(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT);
            }));
        });
        describe('validateRefreshToken', () => {
            it('Должен возвращать statusCode, если формат токена недействителен', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockToken = 'invalidFormatToken';
                const result = yield contextTests_1.contextTests.tokenService.validateRefreshToken(mockToken);
                expect(result).toBe(utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT);
            }));
            it('Должен возвращать данные пользователя, если токен действителен', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2RhZDQ0MGIxMWFlMWRkYWM1YjNkNDkiLCJkZXZpY2VJZCI6IjI0ODE5NzFiLTFhMGItNDg5YS1hNzUwLTEzZTdkNzE4NDBjMSIsImlhdCI6MTc0MjM5NDQzMywiZXhwIjoxNzQ0OTg2NDMzfQ.IXmPr9i21eDiUzL8X-1MPoRnpnxsOVglFc01tRPXY7Q';
                const mockUserData = { userId: '67dad3dc965cc9ac98d98e1c' }; // Типизируем возвращаемое значение
                jsonwebtoken_1.default.verify = jest.fn().mockReturnValueOnce(mockUserData);
                const result = yield contextTests_1.contextTests.tokenService.validateRefreshToken(mockToken);
                expect(result).toEqual(mockUserData);
            }));
        });
        describe('saveBlackListToken', () => {
            it('Должен вставить токен в базу данных', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockUserId = '123';
                const mockRefreshToken = 'mockRefreshToken';
                // Мокируем MongoDB метод insertOne, используя типизацию
                contextTests_1.contextTests.mongoDBCollection.tokensCollection.insertOne.mockResolvedValueOnce({ insertedId: new mongodb_1.ObjectId() });
                const result = yield contextTests_1.contextTests.tokenService.saveRefreshTokenBlackList(mockUserId, mockRefreshToken);
                expect(result).toEqual({ insertedId: expect.any(mongodb_1.ObjectId) });
                expect(contextTests_1.contextTests.mongoDBCollection.tokensCollection.insertOne).toHaveBeenCalledWith({ userId: mockUserId, refreshToken: mockRefreshToken });
            }));
            it('Должен возвращать объект ошибки, если произошла ошибка', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockUserId = '123';
                const mockRefreshToken = 'mockRefreshToken';
                // Мокируем MongoDB метод insertOne, используя типизацию
                const mockError = utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST;
                contextTests_1.contextTests.mongoDBCollection.tokensCollection.insertOne.mockRejectedValueOnce(mockError);
                const result = yield contextTests_1.contextTests.tokenService.saveRefreshTokenBlackList(mockUserId, mockRefreshToken);
                // Проверяем, что результат равен объекту ошибки
                expect(result).toBe(mockError);
            }));
        });
        describe('removeToken', () => {
            it('Должен удалить токен из базы данных', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockRefreshToken = 'mockRefreshToken';
                // Мокируем MongoDB метод deleteOne, используя типизацию
                contextTests_1.contextTests.mongoDBCollection.tokensCollection.deleteOne.mockResolvedValueOnce({ deletedCount: 1 });
                const result = yield contextTests_1.contextTests.tokenService.deleteRefreshTokenByTokenInBlackList(mockRefreshToken);
                expect(result).toEqual({ deletedCount: 1 });
                expect(contextTests_1.contextTests.mongoDBCollection.tokensCollection.deleteOne).toHaveBeenCalledWith({ refreshToken: mockRefreshToken });
            }));
        });
        describe('findToken', () => {
            it('Должен возвращать данные о маркере из базы данных', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockRefreshToken = 'mockRefreshToken';
                const mockTokenData = { userId: '123', refreshToken: mockRefreshToken };
                // Мокируем MongoDB метод findOne, используя типизацию
                contextTests_1.contextTests.mongoDBCollection.tokensCollection.findOne.mockResolvedValueOnce(mockTokenData);
                const result = yield contextTests_1.contextTests.tokenService.getRefreshTokenByTokenInBlackList(mockRefreshToken);
                expect(result).toEqual(mockTokenData);
            }));
            it('Должен возвращать null, если токен не найден', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockRefreshToken = 'mockRefreshToken';
                // Мокируем MongoDB метод findOne, используя типизацию
                contextTests_1.contextTests.mongoDBCollection.tokensCollection.findOne.mockResolvedValueOnce(null);
                const result = yield contextTests_1.contextTests.tokenService.getRefreshTokenByTokenInBlackList(mockRefreshToken);
                expect(result).toBeNull();
            }));
        });
    });
};
exports.authUnitTest = authUnitTest;
