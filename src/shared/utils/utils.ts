import { AUTH_INTERNAL_STATUS } from "../../services/auth/internalStatusAuthErrors/authStatus"
import { BLOGS_INTERNAL_STATUS } from "../../services/blogs/internalStatusBlogsErrors/blogsStatus"
import { COMMENT_INTERNAL_STATUS } from "../../services/comments/internalStatusCommentsErrors/commentStatus"
import { POSTS_INTERNAL_STATUS } from "../../services/posts/internalStatusPostsErrors/postsStatus"
import { USERS_INTERNAL_STATUS } from "../../services/users/internalStatusUsersErrors/usersStatus"
import { SESSIONS_INTERNAL_STATUS } from "../../services/usersSessions/internalStatusSessionsErrors/sessionsStatus"

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

export const INTERNAL_STATUS_CODE = {
    ...AUTH_INTERNAL_STATUS,
    ...SESSIONS_INTERNAL_STATUS,
    ...USERS_INTERNAL_STATUS,
    ...BLOGS_INTERNAL_STATUS,
    ...POSTS_INTERNAL_STATUS,
    ...COMMENT_INTERNAL_STATUS,

    SUCCESS: 900, // Успешное создание с оправкой ответа!
    CREATED: 960,
    NOT_FOUND: 950, // Не найдено!
    NO_CONTENT: 940, // Успешное создание без оправки ответа!
    BAD_REQUEST: 930, // Отклонено!
    UNAUTHORIZED: 910, // Не авторизован! 
    ACCOUNT_SUCCESSFULLY_CONFIRMED: 1008, // Аккаунт успешно подтверждён!
    SERVICE_UNAVAILABLE: 503, // Сервис временно недоступен. Попробуйте позже!
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422, // Отправка SMS временно недоступна!
    BAD_REQUEST_TOO_MANY_REQUESTS: 429, // Cлишком много запросов!

    // CONFIRMED
    BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT: 931, // Код подтверждения неверен, истек или уже был применен! 
    BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED: 932, // Пользователь с таким email не найден или email уже подтверждён!
}

