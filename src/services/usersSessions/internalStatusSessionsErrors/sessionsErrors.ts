import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "../../../shared/utils/utils";

export const SESSIONS_STATUS_POSITIVE = {
    [INTERNAL_STATUS_CODE.SUCCESS_CREATED_SESSIONS]: {
        messages: { message: 'Успешное создание сессии', sucsees: 'sucsees' },
        statusCode: HTTP_STATUSES.OK_200,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS]: {
        messages: { message: 'Успешное удаление всех сессий!', sucsees: 'sucsees' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID]: {
        messages: { message: 'Успешное удаление сессии по deviceId!', sucsees: 'sucsees' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
}

export const SESSIONS_ERRORS = {
    // SESSIONS
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_SESSION_CREATION_ERROR]: {
        messages: { message: 'Ошибка создания сессии', field: 'auth' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_SESSION_UPDATION_ERROR]: {
        messages: { message: 'Ошибка обновления сессии', field: 'auth' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_SESSION_DELETION_ERROR]: {
        messages: { message: 'Ошибка удаления сессии', field: 'auth' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND]: {
        messages: { message: 'Такой сессии не найдено!', field: 'delete session' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION]: {
        messages: { message: 'Не корректный запрос, вы не являетесь владельцем этой сессии!', field: 'session' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    }
}