"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuccessfulResAndHttpStatusCodeArr = exports.ErMsgAndHttpStatusCodeArr = void 0;
const authErrors_1 = require("../../services/auth/internalStatusAuthErrors/authErrors");
const blogsErrors_1 = require("../../services/blogs/internalStatusBlogsErrors/blogsErrors");
const commentsErrors_1 = require("../../services/comments/internalStatusCommentsErrors/commentsErrors");
const postsErrors_1 = require("../../services/posts/internalStatusPostsErrors/postsErrors");
const usersErrors_1 = require("../../services/users/internalStatusUsersErrors/usersErrors");
const sessionsErrors_1 = require("../../services/usersSessions/internalStatusSessionsErrors/sessionsErrors");
const utils_1 = require("./utils");
exports.ErMsgAndHttpStatusCodeArr = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, authErrors_1.AUTH_ERRORS), sessionsErrors_1.SESSIONS_ERRORS), usersErrors_1.USERS_ERRORS), blogsErrors_1.BLOGS_ERRORS), postsErrors_1.POSTS_ERRORS), commentsErrors_1.COMMENTS_ERRORS), { [utils_1.INTERNAL_STATUS_CODE.NOT_FOUND]: {
        messages: { message: 'По Вашему запросу ничего не найдено!', field: 'auth' },
        statusCode: utils_1.HTTP_STATUSES.NOT_FOUND_404,
    }, [utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_TOO_MANY_REQUESTS]: {
        messages: { message: 'Слишком много запросов!', field: 'field' },
        statusCode: utils_1.HTTP_STATUSES.TOO_MANY_REQUESTS,
    } });
exports.SuccessfulResAndHttpStatusCodeArr = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, authErrors_1.AUTH_STATUS_POSITIVE), sessionsErrors_1.SESSIONS_STATUS_POSITIVE), usersErrors_1.USERS_STATUS_POSITIVE), blogsErrors_1.BLOGS_STATUS_POSITIVE), postsErrors_1.POSTS_STATUS_POSITIVE), commentsErrors_1.COMMENTS_STATUS_POSITIVE), { [utils_1.HTTP_STATUSES.OK_200]: {
        messages: { message: 'Успех', sucsees: 'sucsees' },
        statusCode: utils_1.HTTP_STATUSES.OK_200,
    }, [utils_1.HTTP_STATUSES.NO_CONTENT_204]: {
        messages: { message: 'NO_CONTENT_204', sucsees: 'sucsees' },
        statusCode: utils_1.HTTP_STATUSES.NO_CONTENT_204,
    }, [utils_1.INTERNAL_STATUS_CODE.NO_CONTENT]: {
        messages: { message: 'NO_CONTENT_204', sucsees: 'sucsees' },
        statusCode: utils_1.HTTP_STATUSES.NO_CONTENT_204,
    }, [utils_1.INTERNAL_STATUS_CODE.SUCCESS]: {
        messages: { message: 'Успех', field: 'sucsees' },
        statusCode: utils_1.HTTP_STATUSES.OK_200,
    }, [utils_1.INTERNAL_STATUS_CODE.ACCOUNT_SUCCESSFULLY_CONFIRMED]: {
        messages: { message: 'Аккаунт успешно подтверждён!', field: 'confirm' },
        statusCode: utils_1.HTTP_STATUSES.OK_200,
    } });
