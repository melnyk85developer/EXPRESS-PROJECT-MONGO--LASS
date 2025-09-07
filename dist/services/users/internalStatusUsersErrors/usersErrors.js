"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USERS_ERRORS = exports.USERS_STATUS_POSITIVE = void 0;
const utils_1 = require("../../../shared/utils/utils");
exports.USERS_STATUS_POSITIVE = {
    [utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_USER]: {
        messages: { message: 'Успешное создание пользователя!', field: 'user' },
        statusCode: utils_1.HTTP_STATUSES.CREATED_201,
    },
    [utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_USER]: {
        messages: { message: 'Успешное обновление пользователя!', field: 'user' },
        statusCode: utils_1.HTTP_STATUSES.NO_CONTENT_204,
    },
    [utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_USER]: {
        messages: { message: 'Успешное удаление пользователя!', field: 'user' },
        statusCode: utils_1.HTTP_STATUSES.NO_CONTENT_204,
    },
};
exports.USERS_ERRORS = {
    [utils_1.INTERNAL_STATUS_CODE.USER_NOT_FOUND]: {
        messages: { message: 'Такого пользователя не найденно!', field: 'user' },
        statusCode: utils_1.HTTP_STATUSES.NOT_FOUND_404,
    },
    [utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_UPDATED_USER]: {
        messages: { message: 'Произошла ошибка при обновлении пользователя!', field: 'user' },
        statusCode: utils_1.HTTP_STATUSES.BAD_REQUEST_400,
    },
    [utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_USER]: {
        messages: { message: 'Произошла ошибка при удалении пользователя!', field: 'user' },
        statusCode: utils_1.HTTP_STATUSES.BAD_REQUEST_400,
    },
};
