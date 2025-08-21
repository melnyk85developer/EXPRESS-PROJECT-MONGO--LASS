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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsControllers = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils/utils");
const blogsServices_1 = require("./blogsServices");
const postQueryRepository_1 = require("../posts/PostRepository/postQueryRepository");
const blogQueryRepository_1 = require("./BlogsRepository/blogQueryRepository");
const postsServices_1 = require("../posts/postsServices");
const SuccessfulResponse_1 = require("../../utils/SuccessfulResponse");
const ErResSwitch_1 = require("../../utils/ErResSwitch");
const blogArrayMiddlewares_1 = require("./BlogsMiddlewares/blogArrayMiddlewares");
const blogsControllers = () => {
    const router = express_1.default.Router();
    router.get('/', blogArrayMiddlewares_1.getBlogsMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.HTTP_STATUSES.OK_200, undefined, yield blogQueryRepository_1.blogsQueryRepository.getAllBlogsRepository(req));
    }));
    router.get('/:blogId/posts', blogArrayMiddlewares_1.getBlogIdAllPostsMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, yield postQueryRepository_1.postsQueryRepository.getAllPostsRepositories(req));
    }));
    router.get('/:id', blogArrayMiddlewares_1.getBlogIdMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, yield blogQueryRepository_1.blogsQueryRepository.getBlogByIdRepository(req.params.id));
    }));
    router.post('/', blogArrayMiddlewares_1.postBlogMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const createBlog = yield blogsServices_1.blogsServices.createBlogServices(req.body);
        if (createBlog && createBlog.acknowledged === true) {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_BLOG, undefined, yield blogQueryRepository_1.blogsQueryRepository.getBlogByIdRepository(createBlog.insertedId));
        }
        else {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, createBlog);
        }
    }));
    router.post('/:blogId/posts', blogArrayMiddlewares_1.postBlogIdOnePostMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const createPostOneBlog = yield postsServices_1.postsServices.createPostOneBlogServices(req);
        if (createPostOneBlog && createPostOneBlog.acknowledged === true) {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST, undefined, yield postQueryRepository_1.postsQueryRepository.getPostByIdRepositories(createPostOneBlog.insertedId));
        }
        else {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, createPostOneBlog);
        }
    }));
    router.put('/:id', blogArrayMiddlewares_1.updateBlogMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const updateBlog = yield blogsServices_1.blogsServices.updateBlogServices(req.params.id, req.body);
        if (updateBlog && updateBlog.acknowledged === true) {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_BLOG, undefined, yield postQueryRepository_1.postsQueryRepository.getPostByIdRepositories(updateBlog.insertedId));
        }
        else {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, updateBlog);
        }
    }));
    router.delete('/:id', blogArrayMiddlewares_1.deleteBlogMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield blogsServices_1.blogsServices.deleteBlogServices(req.params.id);
        if (blog && blog.acknowledged === true) {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_BLOG);
        }
        else {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, blog);
        }
    }));
    return router;
};
exports.blogsControllers = blogsControllers;
