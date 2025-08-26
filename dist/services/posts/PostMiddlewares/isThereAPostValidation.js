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
exports.PostsMiddlewares = void 0;
require("reflect-metadata");
const utils_1 = require("../../../shared/utils/utils");
;
const ErResSwitch_1 = require("../../../shared/utils/ErResSwitch");
const inversify_1 = require("inversify");
const postQueryRepository_1 = require("../PostRepository/postQueryRepository");
let PostsMiddlewares = class PostsMiddlewares {
    constructor(
    // @inject(TYPES.PostsQueryRepository)
    postsQueryRepository) {
        this.postsQueryRepository = postsQueryRepository;
        this.postIdMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield this.postsQueryRepository.getPostByIdRepositories(req.params.id);
            if (!foundPost) {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.POST_NOT_FOUND_ID);
            }
            next();
            return;
        });
        this.postPostIdMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield this.postsQueryRepository.getPostByIdRepositories(req.params.postId);
            if (!foundPost) {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.POST_NOT_FOUND_POST_ID);
            }
            next();
            return;
        });
    }
};
exports.PostsMiddlewares = PostsMiddlewares;
exports.PostsMiddlewares = PostsMiddlewares = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [postQueryRepository_1.PostsQueryRepository])
], PostsMiddlewares);
