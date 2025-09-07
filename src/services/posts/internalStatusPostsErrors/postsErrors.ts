import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "../../../shared/utils/utils";

export const POSTS_STATUS_POSITIVE = {
    [INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST]: {
        messages: { message: 'Успешное создание поста!', field: 'post' },
        statusCode: HTTP_STATUSES.CREATED_201,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_UPDATED_POST]: {
        messages: { message: 'Пост успешно обновлён!', field: 'post' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_DELETED_POST]: {
        messages: { message: 'Успешное удаление поста!', field: 'post' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
}

export const POSTS_ERRORS = {
    [INTERNAL_STATUS_CODE.POST_NOT_FOUND_POST_ID]: {
        messages: { message: 'Такого поста c таким postId не найденно!', field: 'postId' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID]: {
        messages: { message: 'Такого поста c таким id не найденно!', field: 'post' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_POST]: {
        messages: { message: 'Произошла ошибка при удалении поста!', field: 'post' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
}