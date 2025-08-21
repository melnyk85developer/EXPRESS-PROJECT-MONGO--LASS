"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentCommentIdMiddleware = exports.commentIdMiddleware = void 0;
const utils_1 = require("../../../utils/utils");
const postQueryRepository_1 = require("../../posts/PostRepository/postQueryRepository");
const commentsRepository_1 = require("../CommentRepository/commentsRepository");
const ErResSwitch_1 = require("../../../utils/ErResSwitch");
const commentIdMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT);
    }
    const foundComment = yield commentsRepository_1.commentsRepository._getCommentRepository(req.params.id);
    if (!foundComment) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND);
    }
    next();
    return;
});
exports.commentIdMiddleware = commentIdMiddleware;
//TODO: проверить params, по default express-validator 
const commentCommentIdMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.commentId) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT);
    }
    const foundComment = yield commentsRepository_1.commentsRepository._getCommentRepository(req.params.commentId);
    if (!foundComment) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND);
    }
    const foundPost = yield postQueryRepository_1.postsQueryRepository.getPostByIdRepositories(foundComment.postId);
    if (!foundPost) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID);
    }
    next();
    return;
});
exports.commentCommentIdMiddleware = commentCommentIdMiddleware;
