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
exports.commentsController = exports.CommentsControllers = void 0;
const utils_1 = require("../../shared/utils/utils");
const commentsServices_1 = require("./commentsServices");
const commentsQueryRepository_1 = require("./CommentRepository/commentsQueryRepository");
const SuccessfulResponse_1 = require("../../shared/utils/SuccessfulResponse");
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
class CommentsControllers {
    getCommentByIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundComment = yield commentsQueryRepository_1.commentsQueryRepository.getCommentByIdRepository(req.params.id);
            if (foundComment && foundComment.id) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, foundComment);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.NOT_FOUND);
            }
        });
    }
    updateCommentController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateComment = yield commentsServices_1.commentsServices.updateCommentServices(req.params.commentId, req.user.id, req.body);
            if (updateComment.acknowledged === true) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_COMMENT);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, updateComment);
            }
        });
    }
    deleteCommentController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commsnt = yield commentsServices_1.commentsServices.deleteCommentServices(req.params.commentId, req.user.id);
            if (commsnt && commsnt.acknowledged === true) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_COMMENT);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, commsnt);
            }
        });
    }
}
exports.CommentsControllers = CommentsControllers;
exports.commentsController = new CommentsControllers();
