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
exports.CommentsControllers = void 0;
const utils_1 = require("../../shared/utils/utils");
// import { SuccessfulResponse } from '../../shared/utils/SuccessfulResponse';
const ErRes_1 = require("../../shared/utils/ErRes");
const inversify_1 = require("inversify");
const commentsServices_1 = require("./commentsServices");
const commentsQueryRepository_1 = require("./CommentRepository/commentsQueryRepository");
const SuccessResponse_1 = require("../../shared/utils/SuccessResponse");
let CommentsControllers = class CommentsControllers {
    constructor(commentsServices, commentsQueryRepository) {
        this.commentsServices = commentsServices;
        this.commentsQueryRepository = commentsQueryRepository;
    }
    getCommentByIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundComment = yield this.commentsQueryRepository.getCommentByIdRepository(req.params.id);
            if (foundComment && foundComment.id) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS, foundComment, undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.NOT_FOUND, undefined, undefined, req, res);
            }
        });
    }
    updateCommentController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateComment = yield this.commentsServices.updateCommentServices(req.params.commentId, req.user.id, req.body);
            if (updateComment.acknowledged === true) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_COMMENT, undefined, undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(updateComment, undefined, undefined, req, res);
            }
        });
    }
    deleteCommentController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const commsnt = yield this.commentsServices.deleteCommentServices(req.params.commentId, req.user.id);
            if (commsnt && commsnt.acknowledged === true) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_COMMENT, undefined, undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(commsnt, undefined, undefined, req, res);
            }
        });
    }
};
exports.CommentsControllers = CommentsControllers;
exports.CommentsControllers = CommentsControllers = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(commentsServices_1.CommentsServices)),
    __param(1, (0, inversify_1.inject)(commentsQueryRepository_1.CommentsQueryRepository)),
    __metadata("design:paramtypes", [commentsServices_1.CommentsServices,
        commentsQueryRepository_1.CommentsQueryRepository])
], CommentsControllers);
