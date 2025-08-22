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
exports.postPostIdMiddleware = exports.postIdMiddleware = void 0;
const utils_1 = require("../../../shared/utils/utils");
const postQueryRepository_1 = require("../PostRepository/postQueryRepository");
const ErResSwitch_1 = require("../../../shared/utils/ErResSwitch");
const postIdMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield postQueryRepository_1.postsQueryRepository.getPostByIdRepositories(req.params.id);
    if (!foundPost) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID);
    }
    next();
    return;
});
exports.postIdMiddleware = postIdMiddleware;
const postPostIdMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const foundPost = yield postQueryRepository_1.postsQueryRepository.getPostByIdRepositories(req.params.postId);
    if (!foundPost) {
        return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.POST_NOT_FOUND_POST_ID);
    }
    next();
    return;
});
exports.postPostIdMiddleware = postPostIdMiddleware;
