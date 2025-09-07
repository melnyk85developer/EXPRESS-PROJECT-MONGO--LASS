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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.СommentsMiddlewares = void 0;
const utils_1 = require("../../../shared/utils/utils");
const ErRes_1 = require("../../../shared/utils/ErRes");
const inversify_1 = require("inversify");
const postQueryRepository_1 = require("../../posts/PostRepository/postQueryRepository");
const commentsRepository_1 = require("../CommentRepository/commentsRepository");
let СommentsMiddlewares = class СommentsMiddlewares {
    constructor(postsQueryRepository, commentsRepository) {
        this.postsQueryRepository = postsQueryRepository;
        this.commentsRepository = commentsRepository;
        this.commentIdMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.params.id) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT, undefined, undefined, req, res);
            }
            const foundComment = yield this.commentsRepository._getCommentRepository(req.params.id);
            if (!foundComment) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND, undefined, undefined, req, res);
            }
            next();
            return;
        });
        this.commentCommentIdMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            if (!req.params.commentId) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_NO_PARAMS_FOR_GET_COMMENT, undefined, undefined, req, res);
            }
            const foundComment = yield this.commentsRepository._getCommentRepository(req.params.commentId);
            if (!foundComment) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.COMMENT_NOT_FOUND, undefined, undefined, req, res);
            }
            const foundPost = yield this.postsQueryRepository.getPostByIdRepositories(foundComment.postId);
            if (!foundPost) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID, undefined, undefined, req, res);
            }
            next();
            return;
        });
    }
};
exports.СommentsMiddlewares = СommentsMiddlewares;
exports.СommentsMiddlewares = СommentsMiddlewares = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(postQueryRepository_1.PostsQueryRepository)),
    __param(1, (0, inversify_1.inject)(commentsRepository_1.CommentsRepository)),
    __metadata("design:paramtypes", [postQueryRepository_1.PostsQueryRepository,
        commentsRepository_1.CommentsRepository])
], СommentsMiddlewares);
