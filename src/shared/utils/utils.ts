export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    NOT_FOUND_404: 404,
    TOO_MANY_REQUESTS: 429,
}
type HttpStatusKeys = keyof typeof HTTP_STATUSES
export type HttpStatusType = (typeof HTTP_STATUSES)[HttpStatusKeys]

export enum INTERNAL_STATUS_CODE {
    SUCCESS = 900, // Успешное создание с оправкой ответа!
    SUCCESS_CREATED_USER = 991, // Создан пользователь!
    SUCCESS_UPDATED_USER = 992, // Обновлен пользователь!
    SUCCESS_DELETED_USER = 993, // Успешное удаление пользователя!

    SUCCESS_CREATED_SESSIONS = 994, // Успешное создание сессии!
    SUCCESS_DELETED_SESSIONS = 995, // Успешное удаление сессии!
    SUCCESS_DELETED_OTHER_SESSIONS = 996, // Успешное удаление других сессий!
    SUCCESS_DELETED_SESSIONS_BY_DEVICE_ID = 997, // Успешное удаление сессии по deviceId!
    SUCCESS_DELETED_ALL_SESSIONS = 998, // Успешное удаление всех сессий!
    SUCCESS_CREATED_REFRESH_TOKEN = 999, // Успешное создание refresh-token!

    SUCCESS_CREATED_BLOG = 890, // Успешное создание блога!
    SUCCESS_UPDATED_BLOG = 891, // Успешное удаление блога!
    SUCCESS_DELETED_BLOG = 892, // Успешное создание блога!

    SUCCESS_CREATED_POST = 980, // Успешное создание поста!
    SUCCESS_UPDATED_POST = 981, // Успешное удаление поста!
    SUCCESS_DELETED_POST = 982, // Успешное создание поста!

    SUCCESS_CREATED_COMMENT = 970, // Успешное создание комментария!
    SUCCESS_UPDATED_COMMENT = 971, // Успешное обновление комментария!
    SUCCESS_DELETED_COMMENT = 972, // Успешное удаление комментария!

    CREATED = 960,

    NOT_FOUND = 950, // Не найдено!
    POST_NOT_FOUND_POST_ID = 951, // Такого поста не обнаружено!
    POST_NOT_FOUND_ID = 956, // Такого поста не обнаружено!
    BLOG_NOT_FOUND_BLOG_ID = 954, // Такого блога не обнаружено!
    BLOG_NOT_FOUND_ID = 955, // Такого блога не обнаружено!
    COMMENT_NOT_FOUND = 952, // Такого комментария не обнаружено!
    USER_NOT_FOUND = 953, // Такого пользователя не найденно! 

    NO_CONTENT = 940, // Успешное создание без оправки ответа!

    BAD_REQUEST = 930, // Отклонено!

    // CONFIRMED
    BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT = 931, // Код подтверждения неверен, истек или уже был применен! 
    BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED = 932, // Пользователь с таким email не найден или email уже подтверждён!
    // AUTH
    BAD_REQUEST_TНE_LOGIN_ALREADY_EXISTS = 933, // Логин уже занят!
    BAD_REQUEST_TНE_EMAIL_ALREADY_EXISTS = 934, // Email уже занят!
    // USER
    BAD_REQUEST_ERROR_UPDATED_USER = 935, // Ошибка обновления пользователя!
    BAD_REQUEST_ERROR_DELETED_USER = 936, // Ошибка удаления пользователя!
    // POST
    BAD_REQUEST_NO_BLOG_TO_CREATE_THIS_POST = 937, // Блога для создания этого поста не обнаруженно"
    BAD_REQUEST_UPDATED_POST = 938, // Произошла ошибка при обновлении поста!
    BAD_REQUEST_ERROR_DELETED_POST = 939, // Произошла ошибка при удалении поста!
    // COMMENTS
    BAD_REQUEST_NO_POST_FOR_THIS_COMMENTS = 920, // Поста для получения комментариев не обнаруженно"
    // BAD_REQUEST_NO_POST_TO_CREATE_THIS_COMMENT = 921, // Поста для создания этого комментария не обнаруженно"
    BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST = 922, // Ошибка при добавлении рефреш-токена в черный список! 
    BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT = 923, //Отсутствуют параметры для получения коментария
    // FORBIDDEN
    FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_COMMENT = 924, // Не корректный запрос, вы не являетесь влядельцем комментария
    // SESSION
    FORBIDDEN_DELETED_YOU_ARE_NOT_THE_OWNER_OF_THE_SESSION = 1009, // Не корректный запрос, вы не являетесь влядельцем сессии
    SESSION_ID_NOT_FOUND = 925, // Сессия не найдена!

    UNAUTHORIZED = 910, // Не авторизован! 

    UNAUTHORIZED_SESSION_CREATION_ERROR = 913, // Ошибка создания сессии! 
    UNAUTHORIZED_SESSION_UPDATION_ERROR = 927, // Ошибка обновления сессии!
    UNAUTHORIZED_SESSION_DELETION_ERROR = 928, // Ошибка удаления сессии!
    
    REFRESH_TOKEN_VALIDATION_ERROR = 926, // Ошибка валидации refresh-token!

    UNAUTHORIZED_TOKEN_CREATION_ERROR = 911, // Ошибка создания токена!
    UNAUTHORIZED_NO_REFRESH_TOKEN = 912, // Отсутствует refresh-token! 
    UNAUTHORIZED_ACCESS_TOKEN_LENGHT = 914, //  Отсутствует или не правельный формат accessToken! 
    UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT = 915, //  Не правильный формат accessToken! 
    UNAUTHORIZED_INVALID_ACCESS_TOKEN = 916, //  Вы прислали не валидный токен! 

    UNAUTHORIZED_REFRESH = 917, //  Отсутствует или не правельный формат refresh! 
    UNAUTHORIZED_REFRESH_TOKEN_LENGHT = 918, //  Отсутствует или не правельный формат refresh! 
    UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT = 919, //  Не правильный формат refresh! 
    UNAUTHORIZED_INVALID_REFRESH_TOKEN = 901, //  Вы прислали не валидный токен! 
    UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST = 902, //  Онулирован refresh-token! 
    ERROR_REFRESH_TOKEN_BLACK_LIST = 905, //  Ошибка добавления рефрешь токена в чёрный список! 
    UNAUTHORIZED_PASSWORD_OR_EMAIL_MISSPELLED = 903, // Логин или пароль указан не верно!
    UNAUTHORIZED_LOGIN_OR_PASSWORD_IS_NOT_CORRECT = 904, // Логин или пароль указанны не верно!
    
    ACCOUNT_SUCCESSFULLY_CONFIRMED = 1008, // Аккаунт успешно подтверждён!

    SERVICE_UNAVAILABLE = 503, // Сервис временно недоступен. Попробуйте позже!
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422, // Отправка SMS временно недоступна!
    BAD_REQUEST_TOO_MANY_REQUESTS = 429, // Cлишком много запросов!
}

  