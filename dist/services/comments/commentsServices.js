"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.CommentsServices = void 0;
require("reflect-metadata");
const utils_1 = require("../../shared/utils/utils");
const inversify_1 = require("inversify");
const commentsRepository_1 = require("./CommentRepository/commentsRepository");
let CommentsServices = class CommentsServices {
    constructor(
    // @inject(TYPES.CommentsRepository)
    commentsRepository) {
        this.commentsRepository = commentsRepository;
    }
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
            const isIdCreateComment = yield this.commentsRepository.createCommentRepository(createComments);
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
            const comment = yield this.commentsRepository._getCommentRepository(commentId);
            if (comment.commentatorInfo.userId === userId) {
                const updatedPost = {
                    content: body.content,
                    postId: comment.postId
                };
                return yield this.commentsRepository.updateCommentRepository(commentId, updatedPost);
            }
            else {
                return utils_1.INTERNAL_STATUS_CODE.FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_COMMENT;
            }
        });
    }
    deleteCommentServices(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentsRepository._getCommentRepository(id);
            if (comment.commentatorInfo.userId === userId) {
                return yield this.commentsRepository.deleteCommentRepository(id);
            }
            else {
                return utils_1.INTERNAL_STATUS_CODE.FORBIDDEN_UPDATE_YOU_ARE_NOT_THE_OWNER_OF_THE_COMMENT;
            }
        });
    }
};
exports.CommentsServices = CommentsServices;
exports.CommentsServices = CommentsServices = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [commentsRepository_1.CommentsRepository])
], CommentsServices);
