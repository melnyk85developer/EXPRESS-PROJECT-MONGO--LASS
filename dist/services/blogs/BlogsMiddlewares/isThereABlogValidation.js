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
exports.BlogValidationMiddlewares = void 0;
const utils_1 = require("../../../shared/utils/utils");
const ErRes_1 = require("../../../shared/utils/ErRes");
const inversify_1 = require("inversify");
const blogQueryRepository_1 = require("../BlogsRepository/blogQueryRepository");
let BlogValidationMiddlewares = class BlogValidationMiddlewares {
    constructor(blogsQueryRepository) {
        this.blogsQueryRepository = blogsQueryRepository;
        this.blogIdMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield this.blogsQueryRepository.getBlogByIdRepository(req.params.id);
            if (!foundBlog) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_ID, undefined, undefined, req, res);
            }
            next();
            return;
        });
        this.isBlogIdMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const foundBlog = yield this.blogsQueryRepository.getBlogByIdRepository(req.params.blogId);
            if (!foundBlog) {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BLOG_NOT_FOUND_BLOG_ID, undefined, undefined, req, res);
            }
            next();
            return;
        });
    }
};
exports.BlogValidationMiddlewares = BlogValidationMiddlewares;
exports.BlogValidationMiddlewares = BlogValidationMiddlewares = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(blogQueryRepository_1.BlogsQueryRepository)),
    __metadata("design:paramtypes", [blogQueryRepository_1.BlogsQueryRepository])
], BlogValidationMiddlewares);
