import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "../../../shared/utils/utils";

export const COMMENTS_ERRORS = {
    [INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND]: {
        messages: { message: 'Такого комментария не обнаружено!', field: 'commentId' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_NO_BLOG_TO_CREATE_THIS_POST]: {
        messages: { message: 'Поста для получения этих комментариев не обнаружено!', field: 'post' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT]: {
        messages: { message: 'Отсутствуют параметры для получения коментария.', field: 'comment' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_COMMENT]: {
        messages: { message: 'Не корректный запрос, вы не являетесь владельцем комментария!', field: 'comment' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
}
export const COMMENTS_STATUS_POSITIVE = {
    [INTERNAL_STATUS_CODE.SUCCESS_CREATED_COMMENT]: {
        messages: { message: 'Успешное создание комментария!', field: 'comment' },
        statusCode: HTTP_STATUSES.CREATED_201,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_UPDATED_COMMENT]: {
        messages: { message: 'Комментарий успешно обновлён!', field: 'update comment' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_DELETED_COMMENT]: {
        messages: { message: 'Комментарий успешно удалён!', field: 'update comment' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
}