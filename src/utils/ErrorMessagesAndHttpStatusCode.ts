import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "./utils";

interface ErrorResponse {
    messages: { message: string; field: string };
    statusCode: number;
}

export const ErMessaAndHttpStatusCodeArr: Record<number, ErrorResponse> = {
    [HTTP_STATUSES.UNAUTHORIZED_401]: {
        messages: { message: 'Не авторизован', field: 'auth' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED]: {
        messages: { message: 'Не авторизован', field: 'auth' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_TOO_MANY_REQUESTS]: {
        messages: { message: 'Слишком много запросов!', field: 'field' },
        statusCode: HTTP_STATUSES.TOO_MANY_REQUESTS,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT]: {
        messages: { message: 'Отсутствует или некорректный access токен!', field: 'auth' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN]: {
        messages: { message: 'Отсутствует refresh токен!', field: 'refreshToken' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT]: {
        messages: { message: 'Отсутствует или некорректный refresh токен!', field: 'auth' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT]: {
        messages: { message: 'Аccess токен имеет неверный формат', field: 'auth' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT]: {
        messages: { message: 'Refresh токен имеет неверный формат', field: 'auth' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN]: {
        messages: { message: 'Вы прислали не валидный access токен!', field: 'auth' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN]: {
        messages: { message: 'Вы прислали не валидный refresh токен!', field: 'auth' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST]: {
        messages: { message: 'Онулирован refresh-token!', field: 'refresh' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.ERROR_REFRESH_TOKEN_BLACK_LIST]: {
        messages: { message: 'Ошибка добавления рефрешь токена в чёрный список!', field: 'refresh' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },


    [INTERNAL_STATUS_CODE.UNAUTHORIZED_LOGIN_OR_PASSWORD_IS_NOT_CORRECT]: {
        messages: { message: 'Login или Пароль указанны не верно!', field: 'loginOrPassword' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_PASSWORD_OR_EMAIL_MISSPELLED]: {
        messages: { message: 'Login или E-Mail указанны не верно!', field: 'emailOrPassword' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.UNAUTHORIZED_TOKEN_CREATION_ERROR]: {
        messages: { message: 'Ошибка создания токенов', field: 'generateTokens' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
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

    [INTERNAL_STATUS_CODE.REFRESH_TOKEN_VALIDATION_ERROR]: {
        messages: { message: 'Ошибка валидации refresh токена', field: 'auth' },
        statusCode: HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [INTERNAL_STATUS_CODE.SESSION_ID_NOT_FOUND]: {
        messages: { message: 'Такой сессии не найдено!', field: 'delete session' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.NOT_FOUND]: {
        messages: { message: 'По Вашему запросу ничего не найдено!', field: 'auth' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.USER_NOT_FOUND]: {
        messages: { message: 'Такого пользователя не найденно!', field: 'user' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_BLOG_ID]: {
        messages: { message: 'Блога с таким blogId не существует!', field: 'blogId' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_ID]: {
        messages: { message: 'Блога с таким id не существует!', field: 'id' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.POST_NOT_FOUND_POST_ID]: {
        messages: { message: 'Такого поста c таким postId не найденно!', field: 'postId' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID]: {
        messages: { message: 'Такого поста c таким id не найденно!', field: 'post' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND]: {
        messages: { message: 'Такого комментария не обнаружено!', field: 'commentId' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_NO_BLOG_TO_CREATE_THIS_POST]: {
        messages: { message: 'Поста для получения этих комментариев не обнаружено!', field: 'post' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_EMAIL_ALREADY_EXISTS]: {
        messages: { message: 'Пользователь с таким E-mail уже существует!', field: 'email' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_LOGIN_ALREADY_EXISTS]: {
        messages: { message: 'Пользователь с таким login уже существует!', field: 'login' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT]: {
        messages: { message: 'Код подтверждения неверен, истек или уже был применен!', field: 'code' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED]: {
        messages: { message: 'Пользователь с таким email не найден или email уже подтверждён!', field: 'email' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST]: {
        messages: { message: 'Ошибка при добавлении refreshToken в черный список!', field: 'auth' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_UPDATED_USER]: {
        messages: { message: 'Произошла ошибка при обновлении пользователя!', field: 'user' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_USER]: {
        messages: { message: 'Произошла ошибка при удалении пользователя!', field: 'user' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_POST]: {
        messages: { message: 'Произошла ошибка при удалении поста!', field: 'post' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT]: {
        messages: { message: 'Отсутствуют параметры для получения коментария.', field: 'comment' },
        statusCode: HTTP_STATUSES.BAD_REQUEST_400,
    },
    [INTERNAL_STATUS_CODE.FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_COMMENT]: {
        messages: { message: 'Не корректный запрос, вы не являетесь владельцем комментария!', field: 'comment' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    },
    [INTERNAL_STATUS_CODE.FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION]: {
        messages: { message: 'Не корректный запрос, вы не являетесь владельцем этой сессии!', field: 'session' },
        statusCode: HTTP_STATUSES.FORBIDDEN_403,
    }
}
export const SuccessfulResAndHttpStatusCodeArr = {
    [HTTP_STATUSES.OK_200]: {
        messages: { message: 'Успех', sucsees: 'sucsees' },
        statusCode: HTTP_STATUSES.OK_200,
    },
    [HTTP_STATUSES.NO_CONTENT_204]: {
        messages: { message: 'NO_CONTENT_204', sucsees: 'sucsees' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
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
    [INTERNAL_STATUS_CODE.NO_CONTENT]: {
        messages: { message: 'NO_CONTENT_204', sucsees: 'sucsees' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [INTERNAL_STATUS_CODE.SUCCESS]: {
        messages: { message: 'Успех', field: 'field' },
        statusCode: HTTP_STATUSES.OK_200,
    },
    [INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED]: {
        messages: { message: 'Аккаунт успешно подтверждён!', field: 'confirm' },
        statusCode: HTTP_STATUSES.OK_200,
    },
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
    [INTERNAL_STATUS_CODE.SUCCESS_CREATED_BLOG]: {
        messages: { message: 'Успешное создание блога!', field: 'blog' },
        statusCode: HTTP_STATUSES.CREATED_201,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_UPDATED_BLOG]: {
        messages: { message: 'Успешное обновление блога!', field: 'blog' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [INTERNAL_STATUS_CODE.SUCCESS_DELETED_BLOG]: {
        messages: { message: 'Блог успешно удален!', field: 'blog' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
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
};
  