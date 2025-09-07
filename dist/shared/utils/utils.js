"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTERNAL_STATUS_CODE = exports.HTTP_STATUSES = void 0;
const authStatus_1 = require("../../services/auth/internalStatusAuthErrors/authStatus");
const blogsStatus_1 = require("../../services/blogs/internalStatusBlogsErrors/blogsStatus");
const commentStatus_1 = require("../../services/comments/internalStatusCommentsErrors/commentStatus");
const postsStatus_1 = require("../../services/posts/internalStatusPostsErrors/postsStatus");
const usersStatus_1 = require("../../services/users/internalStatusUsersErrors/usersStatus");
const sessionsStatus_1 = require("../../services/usersSessions/internalStatusSessionsErrors/sessionsStatus");
exports.HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    BAD_REQUEST_400: 400,
    UNAUTHORIZED_401: 401,
    FORBIDDEN_403: 403,
    NOT_FOUND_404: 404,
    TOO_MANY_REQUESTS: 429,
};
exports.INTERNAL_STATUS_CODE = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, authStatus_1.AUTH_INTERNAL_STATUS), sessionsStatus_1.SESSIONS_INTERNAL_STATUS), usersStatus_1.USERS_INTERNAL_STATUS), blogsStatus_1.BLOGS_INTERNAL_STATUS), postsStatus_1.POSTS_INTERNAL_STATUS), commentStatus_1.COMMENT_INTERNAL_STATUS), { SUCCESS: 900, CREATED: 960, NOT_FOUND: 950, NO_CONTENT: 940, BAD_REQUEST: 930, UNAUTHORIZED: 910, ACCOUNT_SUCCESSFULLY_CONFIRMED: 1008, SERVICE_UNAVAILABLE: 503, CONFLICT: 409, UNPROCESSABLE_ENTITY: 422, BAD_REQUEST_TOO_MANY_REQUESTS: 429, 
    // CONFIRMED
    BAD_REQUEST_THE_CONFIRMATION_CODE_IS_INCORRECT: 931, BAD_REQUEST_USER_NOT_FOUND_OR_EMAIL_ALREADY_CONFIRMED: 932 });
