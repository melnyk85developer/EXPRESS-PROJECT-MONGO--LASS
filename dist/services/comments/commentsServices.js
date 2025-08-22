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
exports.commentsServices = exports.CommentsServices = void 0;
const commentsRepository_1 = require("./CommentRepository/commentsRepository");
const utils_1 = require("../../shared/utils/utils");
class CommentsServices {
    createCommentOnePostServices(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content } = req.body;
            const date = new Date();
            // date.setMilliseconds(0);
            const createdAt = date.toISOString();
            const createComments = {
                postId: req.params.postId,
                content: content,
                commentatorInfo: {
                    userId: req.user.id,
                    userLogin: req.user.login
                },
                createdAt: createdAt
            };
            const isIdCreateComment = yield commentsRepository_1.commentsRepository.createCommentRepository(createComments);
            if (isIdCreateComment) {
                return isIdCreateComment;
            }
            else {
                return null;
            }
        });
    }
    updateCommentServices(commentId, userId, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield commentsRepository_1.commentsRepository._getCommentRepository(commentId);
            if (comment.commentatorInfo.userId === userId) {
                const updatedPost = {
                    content: body.content,
                    postId: comment.postId
                };
                return yield commentsRepository_1.commentsRepository.updateCommentRepository(commentId, updatedPost);
            }
            else {
                return utils_1.INTERNAL_STATUS_CODE.FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_COMMENT;
            }
        });
    }
    deleteCommentServices(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield commentsRepository_1.commentsRepository._getCommentRepository(id);
            if (comment.commentatorInfo.userId === userId) {
                return yield commentsRepository_1.commentsRepository.deleteCommentRepository(id);
            }
            else {
                return utils_1.INTERNAL_STATUS_CODE.FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_COMMENT;
            }
        });
    }
}
exports.CommentsServices = CommentsServices;
exports.commentsServices = new CommentsServices();
