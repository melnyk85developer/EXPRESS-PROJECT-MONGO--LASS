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
const SuccessfulResponse_1 = require("../../shared/utils/SuccessfulResponse");
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
const inversify_1 = require("inversify");
const postQueryRepository_1 = require("../posts/PostRepository/postQueryRepository");
const blogQueryRepository_1 = require("./BlogsRepository/blogQueryRepository");
const postsServices_1 = require("../posts/postsServices");
const blogsServices_1 = require("./blogsServices");
let BlogsControllers = class BlogsControllers {
    constructor(postsQueryRepository, blogsQueryRepository, postsServices, blogsServices) {
        this.postsQueryRepository = postsQueryRepository;
        this.blogsQueryRepository = blogsQueryRepository;
        this.postsServices = postsServices;
        this.blogsServices = blogsServices;
    }
    getBlogsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.HTTP_STATUSES.OK_200, undefined, yield this.blogsQueryRepository.getAllBlogsRepository(req));
        });
    }
    getBlogIdAllPostsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, yield this.postsQueryRepository.getAllPostsRepositories(req));
        });
    }
    getBlogByIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, yield this.blogsQueryRepository.getBlogByIdRepository(req.params.id));
        });
    }
    createBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createBlog = yield this.blogsServices.createBlogServices(req.body);
            if (createBlog && createBlog.acknowledged === true) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_BLOG, undefined, yield this.blogsQueryRepository.getBlogByIdRepository(createBlog.insertedId));
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, createBlog);
            }
        });
    }
    createPostOneBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createPostOneBlog = yield this.postsServices.createPostOneBlogServices(req);
            if (createPostOneBlog && createPostOneBlog.acknowledged === true) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST, undefined, yield this.postsQueryRepository.getPostByIdRepositories(createPostOneBlog.insertedId));
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, createPostOneBlog);
            }
        });
    }
    updateBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateBlog = yield this.blogsServices.updateBlogServices(req.params.id, req.body);
            if (updateBlog && updateBlog.acknowledged === true) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_BLOG, undefined, yield this.postsQueryRepository.getPostByIdRepositories(updateBlog.insertedId));
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, updateBlog);
            }
        });
    }
    deleteBlogController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.blogsServices.deleteBlogServices(req.params.id);
            if (blog && blog.acknowledged === true) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_BLOG);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, blog);
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
