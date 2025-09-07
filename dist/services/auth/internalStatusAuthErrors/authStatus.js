"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTH_INTERNAL_STATUS = void 0;
exports.AUTH_INTERNAL_STATUS = {
    SUCCESS_CREATED_REFRESH_TOKEN: 999, // Успешное создание refresh-token!
    UNAUTHORIZED_TOKEN_CREATION_ERROR: 911, // Ошибка создания токена!
    UNAUTHORIZED_NO_REFRESH_TOKEN: 912, // Отсутствует refresh-token! 
    UNAUTHORIZED_ACCESS_TOKEN_LENGHT: 914, //  Отсутствует или не правельный формат accessToken! 
    UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT: 915, //  Не правильный формат accessToken! 
    UNAUTHORIZED_INVALID_ACCESS_TOKEN: 916, //  Вы прислали не валидный токен! 
    UNAUTHORIZED_REFRESH: 917, //  Отсутствует или не правельный формат refresh! 
    UNAUTHORIZED_REFRESH_TOKEN_LENGHT: 918, //  Отсутствует или не правельный формат refresh! 
    UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT: 919, //  Не правильный формат refresh! 
    UNAUTHORIZED_INVALID_REFRESH_TOKEN: 901, //  Вы прислали не валидный токен! 
    UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST: 902, //  Онулирован refresh-token! 
    UNAUTHORIZED_PASSWORD_OR_EMAIL_MISSPELLED: 903, // Логин или пароль указан не верно!
    UNAUTHORIZED_LOGIN_OR_PASSWORD_IS_NOT_CORRECT: 904, // Логин или пароль указанны не верно!
    BAD_REQUEST_FUNCTION_BLOCKED: 682, /**Функция заблокирована*/
    BAD_REQUEST_TНE_LOGIN_ALREADY_EXISTS: 933, // Логин уже занят!
    BAD_REQUEST_TНE_EMAIL_ALREADY_EXISTS: 934, // Email уже занят!
    BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST: 922, // Ошибка при добавлении рефреш-токена в черный список! 
    BAD_REQUEST_TНE_PASSWORD_CANT_BE_EMPTY: 692, // Password не может быть пустым!
    REFRESH_TOKEN_VALIDATION_ERROR: 926, // Ошибка валидации refresh-token!
    ERROR_REFRESH_TOKEN_BLACK_LIST: 905, //  Ошибка добавления рефрешь токена в чёрный список! 
    BAD_REQUEST_TIME_HASNT_PASSED_YET: 680, /**Время еще не пришло до следующего запроса*/
    BAD_REQUEST_A_LOT_OF_REQUESTS_TRY_AGAIN_LATER: 678, /**Слишком много запросов*/
    BAD_REQUEST_EXPIRATION_TIME_PASSED: 674, /**К сожалению время этого кода активации уже истекло!*/
};
