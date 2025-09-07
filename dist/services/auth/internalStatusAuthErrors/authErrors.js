"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_ERRORS = exports.AUTH_STATUS_POSITIVE = void 0;
const utils_1 = require("../../../shared/utils/utils");
const authStatus_1 = require("./authStatus");
exports.AUTH_STATUS_POSITIVE = {};
exports.AUTH_ERRORS = {
    [authStatus_1.AUTH_INTERNAL_STATUS.BAD_REQUEST_FUNCTION_BLOCKED]: {
        messages: { message: '⛔️ Функция отпрвки сообщения на E-Mail временно заблокирована!', field: 'E-Mail' },
        statusCode: utils_1.HTTP_STATUSES.BAD_REQUEST_400,
    },
    [utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_EMAIL_ALREADY_EXISTS]: {
        messages: { message: 'Пользователь с таким E-mail уже существует!', field: 'email' },
        statusCode: utils_1.HTTP_STATUSES.BAD_REQUEST_400,
    },
    [utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_LOGIN_ALREADY_EXISTS]: {
        messages: { message: 'Пользователь с таким login уже существует!', field: 'login' },
        statusCode: utils_1.HTTP_STATUSES.BAD_REQUEST_400,
    },
    [utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT]: {
        messages: { message: 'Код подтверждения неверен, истек или уже был применен!', field: 'code' },
        statusCode: utils_1.HTTP_STATUSES.BAD_REQUEST_400,
    },
    [utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED]: {
        messages: { message: 'Пользователь с таким email не найден или email уже подтверждён!', field: 'email' },
        statusCode: utils_1.HTTP_STATUSES.BAD_REQUEST_400,
    },
    [utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST]: {
        messages: { message: 'Ошибка при добавлении refreshToken в черный список!', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.BAD_REQUEST_400,
    },
    [authStatus_1.AUTH_INTERNAL_STATUS.BAD_REQUEST_EXPIRATION_TIME_PASSED]: {
        messages: { message: '⛔️ К сожалению время этого кода активации уже истекло!', field: 'code' },
        statusCode: utils_1.HTTP_STATUSES.BAD_REQUEST_400,
    },
    [authStatus_1.AUTH_INTERNAL_STATUS.BAD_REQUEST_TIME_HASNT_PASSED_YET]: {
        messages: { message: '⛔️ Время еще не истекло до следующего запроса', field: 'code' },
        statusCode: utils_1.HTTP_STATUSES.BAD_REQUEST_400,
    },
    [utils_1.HTTP_STATUSES.UNAUTHORIZED_401]: {
        messages: { message: 'Не авторизован', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED]: {
        messages: { message: 'Не авторизован', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT]: {
        messages: { message: 'Отсутствует или некорректный access токен!', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN]: {
        messages: { message: 'Отсутствует refresh токен!', field: 'refreshToken' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT]: {
        messages: { message: 'Отсутствует или некорректный refresh токен!', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT]: {
        messages: { message: 'Аccess токен имеет неверный формат', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT]: {
        messages: { message: 'Refresh токен имеет неверный формат', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN]: {
        messages: { message: 'Вы прислали не валидный access токен!', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN]: {
        messages: { message: 'Вы прислали не валидный refresh токен!', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST]: {
        messages: { message: 'Онулирован refresh-token!', field: 'refresh' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.ERROR_REFRESH_TOKEN_BLACK_LIST]: {
        messages: { message: 'Ошибка добавления рефрешь токена в чёрный список!', field: 'refresh' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_LOGIN_OR_PASSWORD_IS_NOT_CORRECT]: {
        messages: { message: 'Login или Пароль указанны не верно!', field: 'loginOrPassword' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_PASSWORD_OR_EMAIL_MISSPELLED]: {
        messages: { message: 'Login или E-Mail указанны не верно!', field: 'emailOrPassword' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.UNAUTHORIZED_TOKEN_CREATION_ERROR]: {
        messages: { message: 'Ошибка создания токенов', field: 'generateTokens' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
    [utils_1.INTERNAL_STATUS_CODE.REFRESH_TOKEN_VALIDATION_ERROR]: {
        messages: { message: 'Ошибка валидации refresh токена', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.UNAUTHORIZED_401,
    },
};
