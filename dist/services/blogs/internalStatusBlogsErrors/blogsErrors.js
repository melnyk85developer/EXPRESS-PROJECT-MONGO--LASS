"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BLOGS_ERRORS = exports.BLOGS_STATUS_POSITIVE = void 0;
const utils_1 = require("../../../shared/utils/utils");
exports.BLOGS_STATUS_POSITIVE = {
    [utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_BLOG]: {
        messages: { message: 'Успешное создание блога!', field: 'blog' },
        statusCode: utils_1.HTTP_STATUSES.CREATED_201,
    },
    [utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_BLOG]: {
        messages: { message: 'Успешное обновление блога!', field: 'blog' },
        statusCode: utils_1.HTTP_STATUSES.NO_CONTENT_204,
    },
    [utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_BLOG]: {
        messages: { message: 'Блог успешно удален!', field: 'blog' },
        statusCode: utils_1.HTTP_STATUSES.NO_CONTENT_204,
    },
};
exports.BLOGS_ERRORS = {
    [utils_1.INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_BLOG_ID]: {
        messages: { message: 'Блога с таким blogId не существует!', field: 'blogId' },
        statusCode: utils_1.HTTP_STATUSES.NOT_FOUND_404,
    },
    [utils_1.INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_ID]: {
        messages: { message: 'Блога с таким id не существует!', field: 'id' },
        statusCode: utils_1.HTTP_STATUSES.NOT_FOUND_404,
    },
};
