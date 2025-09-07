import { AUTH_ERRORS, AUTH_STATUS_POSITIVE } from "../../services/auth/internalStatusAuthErrors/authErrors";
import { BLOGS_ERRORS, BLOGS_STATUS_POSITIVE } from "../../services/blogs/internalStatusBlogsErrors/blogsErrors";
import { COMMENTS_ERRORS, COMMENTS_STATUS_POSITIVE } from "../../services/comments/internalStatusCommentsErrors/commentsErrors";
import { POSTS_ERRORS, POSTS_STATUS_POSITIVE } from "../../services/posts/internalStatusPostsErrors/postsErrors";
import { USERS_ERRORS, USERS_STATUS_POSITIVE } from "../../services/users/internalStatusUsersErrors/usersErrors";
import { SESSIONS_ERRORS, SESSIONS_STATUS_POSITIVE } from "../../services/usersSessions/internalStatusSessionsErrors/sessionsErrors";
import { HTTP_STATUSES, INTERNAL_STATUS_CODE } from "./utils";

interface ErrorResponse {
    messages: { message: string; field: string };
    statusCode: number;
}
interface SuccessResponse {
  messages: { message: string; field?: string; sucsees?: string };
  statusCode: number;
}
export const ErMsgAndHttpStatusCodeArr: Record<number, ErrorResponse> = {
    ...AUTH_ERRORS,
    ...SESSIONS_ERRORS,
    ...USERS_ERRORS,
    ...BLOGS_ERRORS,
    ...POSTS_ERRORS,
    ...COMMENTS_ERRORS,

    [INTERNAL_STATUS_CODE.NOT_FOUND]: {
        messages: { message: 'По Вашему запросу ничего не найдено!', field: 'auth' },
        statusCode: HTTP_STATUSES.NOT_FOUND_404,
    },
    [INTERNAL_STATUS_CODE.BAD_REQUEST_TOO_MANY_REQUESTS]: {
        messages: { message: 'Слишком много запросов!', field: 'field' },
        statusCode: HTTP_STATUSES.TOO_MANY_REQUESTS,
    },
}
export const SuccessfulResAndHttpStatusCodeArr: Record<number, SuccessResponse> = {
    ...AUTH_STATUS_POSITIVE,
    ...SESSIONS_STATUS_POSITIVE,
    ...USERS_STATUS_POSITIVE,
    ...BLOGS_STATUS_POSITIVE,
    ...POSTS_STATUS_POSITIVE,
    ...COMMENTS_STATUS_POSITIVE,

    [HTTP_STATUSES.OK_200]: {
        messages: { message: 'Успех', sucsees: 'sucsees' },
        statusCode: HTTP_STATUSES.OK_200,
    },
    [HTTP_STATUSES.NO_CONTENT_204]: {
        messages: { message: 'NO_CONTENT_204', sucsees: 'sucsees' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },

    [INTERNAL_STATUS_CODE.NO_CONTENT]: {
        messages: { message: 'NO_CONTENT_204', sucsees: 'sucsees' },
        statusCode: HTTP_STATUSES.NO_CONTENT_204,
    },
    [INTERNAL_STATUS_CODE.SUCCESS]: {
        messages: { message: 'Успех', field: 'sucsees' },
        statusCode: HTTP_STATUSES.OK_200,
    },
    [INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED]: {
        messages: { message: 'Аккаунт успешно подтверждён!', field: 'confirm' },
        statusCode: HTTP_STATUSES.OK_200,
    },
};
