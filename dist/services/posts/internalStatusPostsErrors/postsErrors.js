"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POSTS_ERRORS = exports.POSTS_STATUS_POSITIVE = void 0;
const utils_1 = require("../../../shared/utils/utils");
exports.POSTS_STATUS_POSITIVE = {
    [utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST]: {
        messages: { message: 'Успешное создание поста!', field: 'post' },
        statusCode: utils_1.HTTP_STATUSES.CREATED_201,
    },
    [utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_POST]: {
        messages: { message: 'Пост успешно обновлён!', field: 'post' },
        statusCode: utils_1.HTTP_STATUSES.NO_CONTENT_204,
    },
    [utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_POST]: {
        messages: { message: 'Успешное удаление поста!', field: 'post' },
        statusCode: utils_1.HTTP_STATUSES.NO_CONTENT_204,
    },
};
exports.POSTS_ERRORS = {
    [utils_1.INTERNAL_STATUS_CODE.POST_NOT_FOUND_POST_ID]: {
        messages: { message: 'Такого поста c таким postId не найденно!', field: 'postId' },
        statusCode: utils_1.HTTP_STATUSES.NOT_FOUND_404,
    },
    [utils_1.INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID]: {
        messages: { message: 'Такого поста c таким id не найденно!', field: 'post' },
        statusCode: utils_1.HTTP_STATUSES.NOT_FOUND_404,
    },
    [utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_POST]: {
        messages: { message: 'Произошла ошибка при удалении поста!', field: 'post' },
        statusCode: utils_1.HTTP_STATUSES.BAD_REQUEST_400,
    },
};
