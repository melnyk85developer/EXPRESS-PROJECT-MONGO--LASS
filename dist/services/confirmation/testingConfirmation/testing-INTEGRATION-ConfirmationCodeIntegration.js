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
const authTestManager_1 = require("../../../shared/__tests__/managersTests/authTestManager");
const settings_1 = require("../../../shared/settings");
const contextTests_1 = require("../../../shared/__tests__/contextTests");
const usersTestManager_1 = require("../../../shared/__tests__/managersTests/usersTestManager");
const utils_1 = require("../../../shared/utils/utils");
describe('CONFIRMATION-CODE-INTEGRATION', () => {
    let confirmationService;
    let confirmation;
    beforeEach(() => {
        jest.clearAllMocks();
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, authTestManager_1.getRequest)().delete(`${settings_1.SETTINGS.RouterPath.__test__}/all-data`);
        const userData1 = {
            login: contextTests_1.contextTests.correctUserName1,
            password: contextTests_1.contextTests.correctUserPassword1,
            email: contextTests_1.contextTests.correctUserEmail1
        };
        const { response } = yield usersTestManager_1.usersTestManager.createUser(userData1, contextTests_1.contextTests.codedAuth, utils_1.HTTP_STATUSES.CREATED_201);
        contextTests_1.contextTests.createdUser1 = response;
    }));
    it('GET  - Ожидается статус код 200, - В теле ответа ожидаем пустой массив!', () => __awaiter(void 0, void 0, void 0, function* () {
        yield confirmationService.findAllConfirmationRepository();
        expect.arrayContaining([]);
    }));
    it('GET  - Ожидается статус код 404, - Запрос на не существующий код!', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield confirmationService.findByCodeConfirmationRepository('245678901245678901123456');
        expect(result).toBeNull();
    }));
    it('POST - Ожидается успешный запрос на создание кода подтверждения!', () => __awaiter(void 0, void 0, void 0, function* () {
        const dataCode = {
            confirmationCode: '245678901245678901123456',
            expirationDate: new Date(),
            isBlocked: true,
            field: 'password',
            userId: contextTests_1.contextTests.createdUser1.id
        };
        const result = yield confirmationService.createConfirmationRepository(dataCode);
        confirmation = result.dataValues;
        expect(confirmation).toBeDefined();
        expect(confirmation).toMatchObject({
            confirmationCode: dataCode.confirmationCode,
            isBlocked: dataCode.isBlocked,
            field: dataCode.field,
            userId: dataCode.userId,
        });
        expect(confirmation.id).toBeDefined();
        expect(confirmation.createdAt).toBeInstanceOf(Date);
        expect(confirmation.updatedAt).toBeInstanceOf(Date);
        expect(confirmation.expirationDate).toBeInstanceOf(Date);
        expect(new Date(confirmation.expirationDate).getTime()).toBeCloseTo(dataCode.expirationDate.getTime(), -2);
    }));
    it('PUT  - Успешный запрос на обновление кода подтверждения по userId!', () => __awaiter(void 0, void 0, void 0, function* () {
        const dataCode = {
            confirmationCode: '245678901245678901123456',
            expirationDate: new Date(),
            isBlocked: false,
            field: 'password',
            userId: contextTests_1.contextTests.createdUser1.id
        };
        const result = yield confirmationService.updateConfirmationRepository(confirmation.id, dataCode);
        const updatedConfirmation = result.dataValues;
        expect(updatedConfirmation).toBeDefined();
        expect(updatedConfirmation).toMatchObject({
            confirmationCode: dataCode.confirmationCode,
            isBlocked: dataCode.isBlocked,
            field: dataCode.field,
            userId: dataCode.userId,
        });
        expect(updatedConfirmation.id).toBe(confirmation.id);
        expect(updatedConfirmation.createdAt).toBeInstanceOf(Date);
        expect(updatedConfirmation.updatedAt).toBeInstanceOf(Date);
        expect(updatedConfirmation.expirationDate).toBeInstanceOf(Date);
        expect(new Date(updatedConfirmation.expirationDate).getTime()).toBeCloseTo(dataCode.expirationDate.getTime(), -2);
        expect(new Date(updatedConfirmation.updatedAt).getTime()).toBeGreaterThan(new Date(confirmation.updatedAt).getTime());
    }));
    it('DELETE - Запрос на удаление кода подтверждения по userId!', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield confirmationService.deleteConfirmationUserIdRepository(contextTests_1.contextTests.createdUser1.id);
        expect(result).toBe(1);
    }));
    it('DELETE - Запрос на удаление не существующего кода подтверждения по userId!', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield confirmationService.deleteConfirmationUserIdRepository(contextTests_1.contextTests.createdUser1.id);
        expect(result).toBeGreaterThanOrEqual(0);
    }));
    it('DELETE - Запрос на удаление кода подтверждения по id!', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield confirmationService.deleteConfirmationIdRepository(confirmation.id);
        expect(result).toBeGreaterThanOrEqual(0);
    }));
});
