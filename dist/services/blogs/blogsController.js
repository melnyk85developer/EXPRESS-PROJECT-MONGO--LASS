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
exports.BlogsControllers = void 0;
const utils_1 = require("../../shared/utils/utils");
const ErRes_1 = require("../../shared/utils/ErRes");
const inversify_1 = require("inversify");
const postQueryRepository_1 = require("../posts/PostRepository/postQueryRepository");
const blogQueryRepository_1 = require("./BlogsRepository/blogQueryRepository");
const postsServices_1 = require("../posts/postsServices");
const blogsServices_1 = require("./blogsServices");
const SuccessResponse_1 = require("../../shared/utils/SuccessResponse");
let BlogsControllers = class BlogsControllers {
    constructor(postsQueryRepository, blogsQueryRepository, postsServices, blogsServices) {
        this.postsQueryRepository = postsQueryRepository;
        this.blogsQueryRepository = blogsQueryRepository;
        this.postsServices = postsServices;
        this.blogsServices = blogsServices;
    }
    getBlogsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, SuccessResponse_1.SuccessResponse)(utils_1.HTTP_STATUSES.OK_200, yield this.blogsQueryRepository.getAllBlogsRepository(req), undefined, req, res);
        });
    }
    getBlogIdAllPostsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS, yield this.postsQueryRepository.getAllPostsRepositories(req), undefined, req, res);
        });
    }
    getBlogByIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS, yield this.blogsQueryRepository.getBlogByIdRepository(req.params.id), undefined, req, res);
        });
    }
    createBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createBlog = yield this.blogsServices.createBlogServices(req.body);
            if (createBlog && createBlog.acknowledged === true) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_BLOG, yield this.blogsQueryRepository.getBlogByIdRepository(createBlog.insertedId), undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(createBlog, undefined, undefined, req, res);
            }
        });
    }
    createPostOneBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createPostOneBlog = yield this.postsServices.createPostOneBlogServices(req);
            if (createPostOneBlog && createPostOneBlog.acknowledged === true) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST, yield this.postsQueryRepository.getPostByIdRepositories(createPostOneBlog.insertedId), undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(createPostOneBlog, undefined, undefined, req, res);
            }
        });
    }
    updateBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateBlog = yield this.blogsServices.updateBlogServices(req.params.id, req.body);
            if (updateBlog && updateBlog.acknowledged === true) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_BLOG, yield this.postsQueryRepository.getPostByIdRepositories(updateBlog.insertedId), undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(updateBlog, undefined, undefined, req, res);
            }
        });
    }
    deleteBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsServices.deleteBlogServices(req.params.id);
            if (blog && blog.acknowledged === true) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_BLOG, undefined, undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(blog, undefined, undefined, req, res);
            }
        });
    }
};
exports.BlogsControllers = BlogsControllers;
exports.BlogsControllers = BlogsControllers = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(postQueryRepository_1.PostsQueryRepository)),
    __param(1, (0, inversify_1.inject)(blogQueryRepository_1.BlogsQueryRepository)),
    __param(2, (0, inversify_1.inject)(postsServices_1.PostsServices)),
    __param(3, (0, inversify_1.inject)(blogsServices_1.BlogsServices)),
    __metadata("design:paramtypes", [postQueryRepository_1.PostsQueryRepository,
        blogQueryRepository_1.BlogsQueryRepository,
        postsServices_1.PostsServices,
        blogsServices_1.BlogsServices])
], BlogsControllers);
