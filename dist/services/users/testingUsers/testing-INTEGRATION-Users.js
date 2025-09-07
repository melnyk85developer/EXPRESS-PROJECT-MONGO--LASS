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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordInegrationTest = void 0;
const contextTests_1 = require("../../../shared/__tests__/contextTests");
const usersTestManager_1 = require("../../../shared/__tests__/managersTests/usersTestManager");
const utils_1 = require("../../../shared/utils/utils");
// const mockRepository = {
//     createConfirmationRepository: jest.fn().mockResolvedValue({
//         status: INTERNAL_STATUS_CODE.SUCCESS,
//         expirationDate: '2025-01-01',
//     }),
//     deleteConfirmationIdRepository: jest.fn(),
//     // если сервис читает "последние подтверждения", замокай методы чтения:
//     findManyByUserAndField: jest.fn().mockResolvedValue([]),
//     findLastByUserAndField: jest.fn().mockResolvedValue(null),
//     countInRangeByUserAndField: jest.fn().mockResolvedValue(0),
//     setBlockedForUserAndField: jest.fn().mockResolvedValue(true),
// } as unknown as ConfirmationRepository;
const resetPasswordInegrationTest = () => {
    describe('RESET-PASSWORD-INTEGRATION', () => {
        beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
            const mockRepository = {
                createConfirmationRepository: jest.fn().mockResolvedValue({
                    status: utils_1.INTERNAL_STATUS_CODE.SUCCESS,
                    expirationDate: '2025-01-01',
                }),
                deleteConfirmationIdRepository: jest.fn(),
            };
            contextTests_1.contextTests.confirmationRepository = mockRepository;
            // const mockMailService = {
            //     sendMail: jest.fn().mockResolvedValue(true),
            // };
            // contextTests.mailService = mockMailService
            const userData1 = {
                login: contextTests_1.contextTests.correctUserName1,
                password: contextTests_1.contextTests.correctUserPassword1,
                email: contextTests_1.contextTests.correctUserEmail1
            };
            const { response } = yield usersTestManager_1.usersTestManager.createUser(userData1, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
            contextTests_1.contextTests.createdUser1 = response;
            // console.log('beforeEach: response', response)
            jest.useRealTimers();
        }));
        it('Выбрасывает ошибку, если пользователь не найден', () => __awaiter(void 0, void 0, void 0, function* () {
            const error = yield contextTests_1.contextTests.userService.ressetPasswordService('nonexistent@example.com');
            expect(error.status).toBe(utils_1.INTERNAL_STATUS_CODE.USER_NOT_FOUND);
        }));
        it('Успешно отправляет на email сообщение о попытке сбросить пароль', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield contextTests_1.contextTests.userService.ressetPasswordService(contextTests_1.contextTests.createdUser1.email);
            expect(result.status).toBe(utils_1.INTERNAL_STATUS_CODE.SUCCESS);
        }));
        it('Выбрасывает ошибку, если 3 минуты не прошло с момента отправки сообщения', () => __awaiter(void 0, void 0, void 0, function* () {
            yield contextTests_1.contextTests.userService.ressetPasswordService(contextTests_1.contextTests.createdUser1.email); // Первая попытка
            const error = yield contextTests_1.contextTests.userService.ressetPasswordService(contextTests_1.contextTests.createdUser1.email); // Вторая попытка через короткий промежуток
            expect(error.status).toBe(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_TIME_HASNT_PASSED_YET);
        }));
        it('Блокирует пользователя, если за последние 18 минут было больше 5 запросов', () => __awaiter(void 0, void 0, void 0, function* () {
            for (let i = 0; i < 7; i++) { // первые 5 итераций
                const dataCode = {
                    confirmationCode: '245678901245678901123456',
                    expirationDate: null,
                    isBlocked: false,
                    field: 'password',
                    userId: contextTests_1.contextTests.createdUser1.id,
                };
                // Вычисляем время для каждого запроса, отнимая 18 - i*3 минуты
                dataCode.expirationDate = new Date(Date.now() - (18 * 60 * 1000) + i * (3 * 60 * 1000));
                const isCreatedConfirmation = yield contextTests_1.contextTests.confirmationRepository.createConfirmationRepository(dataCode);
                console.log('ITERATION FOR TEST: isCreatedConfirmation - ', isCreatedConfirmation);
            }
            const error = yield contextTests_1.contextTests.userService.ressetPasswordService(contextTests_1.contextTests.createdUser1.email); // Шестая попытка
            console.log('TEST error:', error);
            expect(error.status).toBe(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_A_LOT_OF_REQUESTS_TRY_AGAIN_LATER);
            // @ts-ignore
            jest.useFakeTimers("modern");
            jest.setSystemTime(new Date(Date.now() + 38 * 60 * 1000));
            const result = yield contextTests_1.contextTests.userService.ressetPasswordService(contextTests_1.contextTests.createdUser1.email);
            console.log('TEST result:', result);
            expect(result.status).toBe(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_FUNCTION_BLOCKED);
            jest.advanceTimersByTime(2 * 60 * 1000);
            // Снимает блокировку 40 мин., если время действия блокировки истекло
            const success = yield contextTests_1.contextTests.userService.ressetPasswordService(contextTests_1.contextTests.createdUser1.email);
            console.log('TEST success:', success);
            expect(success.status).toBe(utils_1.INTERNAL_STATUS_CODE.SUCCESS);
        }));
    });
};
exports.resetPasswordInegrationTest = resetPasswordInegrationTest;
