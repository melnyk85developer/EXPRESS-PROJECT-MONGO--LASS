"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SESSIONS_ERRORS = exports.SESSIONS_STATUS_POSITIVE = void 0;
const utils_1 = require("../../../shared/utils/utils");
exports.SESSIONS_STATUS_POSITIVE = {
    [utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_SESSIONS]: {
        messages: { message: 'Успешное создание сессии', sucsees: 'sucsees' },
        statusCode: utils_1.HTTP_STATUSES.OK_200,
    },
    [utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS]: {
        messages: { message: 'Успешное удаление всех сессий!', sucsees: 'sucsees' },
        statusCode: utils_1.HTTP_STATUSES.NO_CONTENT_204,
    },
    [utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID]: {
        messages: { message: 'Успешное удаление сессии по deviceId!', sucsees: 'sucsees' },
        statusCode: utils_1.HTTP_STATUSES.NO_CONTENT_204,
    },
};
exports.SESSIONS_ERRORS = {
    // SESSIONS
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_SESSION_CREATION_ERROR]: {
        messages: { message: 'Ошибка создания сессии', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_SESSION_UPDATION_ERROR]: {
        messages: { message: 'Ошибка обновления сессии', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_SESSION_DELETION_ERROR]: {
        messages: { message: 'Ошибка удаления сессии', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND]: {
        messages: { message: 'Такой сессии не найдено!', field: 'delete session' },
        statusCode: utils_1.HTTP_STATUSES.NOT_FOUND_404,
    },
    [utils_1.INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION]: {
        messages: { message: 'Не корректный запрос, вы не являетесь владельцем этой сессии!', field: 'session' },
        statusCode: utils_1.HTTP_STATUSES.FORBIDDEN_403,
    }
};
