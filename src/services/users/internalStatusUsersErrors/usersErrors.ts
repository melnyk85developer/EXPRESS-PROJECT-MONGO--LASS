import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "../../../shared/utils/utils";

export const USERS_STATUS_POSITIVE = {
    [INTERNAL_STATUS_CODE.SUCCESS_CREATED_USER]: {
        messages: { message: 'Успешное создание пользователя!', field: 'user' },
        statusCode: HTTP_STATUSES.CREATED_201,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_UPDATED_USER]: {
        messages: { message: 'Успешное обновление пользователя!', field: 'user' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_DELETED_USER]: {
        messages: { message: 'Успешное удаление пользователя!', field: 'user' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
}

export const USERS_ERRORS = {
    [INTERNAL_STATUS_CODE.USER_NOT_FOUND]: {
        messages: { message: 'Такого пользователя не найденно!', field: 'user' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_UPDATED_USER]: {
        messages: { message: 'Произошла ошибка при обновлении пользователя!', field: 'user' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_USER]: {
        messages: { message: 'Произошла ошибка при удалении пользователя!', field: 'user' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
}