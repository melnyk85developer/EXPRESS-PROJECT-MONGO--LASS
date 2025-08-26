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
exports.PostsControllers = void 0;
require("reflect-metadata");
const utils_1 = require("../../shared/utils/utils");
;
const SuccessfulResponse_1 = require("../../shared/utils/SuccessfulResponse");
const ErResSwitch_1 = require("../../shared/utils/ErResSwitch");
const inversify_1 = require("inversify");
const postQueryRepository_1 = require("./PostRepository/postQueryRepository");
const commentsServices_1 = require("../comments/commentsServices");
const commentsQueryRepository_1 = require("../comments/CommentRepository/commentsQueryRepository");
const postsServices_1 = require("./postsServices");
let PostsControllers = class PostsControllers {
    constructor(
    // @inject(TYPES.PostsQueryRepository)
    postsQueryRepository, 
    // @inject(TYPES.CommentsServices)
    commentsServices, 
    // @inject(TYPES.CommentsQueryRepository)
    commentsQueryRepository, 
    // @inject(TYPES.PostsServices)
    postsServices) {
        this.postsQueryRepository = postsQueryRepository;
        this.commentsServices = commentsServices;
        this.commentsQueryRepository = commentsQueryRepository;
        this.postsServices = postsServices;
    }
    getAllPostsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, yield this.postsQueryRepository.getAllPostsRepositories(req));
        });
    }
    getPostByIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield this.postsQueryRepository.getPostByIdRepositories(req.params.id);
            if (foundPost && foundPost.id) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, foundPost);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, 0, foundPost);
            }
        });
    }
    createPostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createPost = yield this.postsServices.createPostServices(req.body);
            if (createPost && createPost.acknowledged) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST, undefined, yield this.postsQueryRepository.getPostByIdRepositories(createPost.insertedId));
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_NO_BLOG_TO_CREATE_THIS_POST);
            }
        });
    }
    getAllCommentsByPostIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield this.postsQueryRepository.getPostByIdRepositories(req.params.postId);
            if (foundPost.id) {
                const comments = yield this.commentsQueryRepository.getAllCommentssRepository(req.params.postId, req.query);
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, comments);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_NO_POST_FOR_THIS_COMMENTS);
            }
        });
    }
    createCommentByPostIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createCommentOnePost = yield this.commentsServices.createCommentOnePostServices(req);
            if (createCommentOnePost && createCommentOnePost.acknowledged) {
                const foundComment = yield this.commentsQueryRepository.getCommentByIdRepository(createCommentOnePost.insertedId);
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_COMMENT, undefined, foundComment);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, 0, 'При получении созданого комментария произошла не известная ошибка!');
            }
        });
    }
    updatePostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatePost = yield this.postsServices.updatePostServices(req.params.id, req.body);
            if (updatePost && updatePost.acknowledged) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_POST);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_UPDATED_POST);
            }
        });
    }
    deletePostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeletedPost = yield this.postsServices.deletePostServices(req.params.id);
            if (isDeletedPost && isDeletedPost.acknowledged) {
                return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_POST);
            }
            else {
                return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_POST);
            }
        });
    }
};
exports.PostsControllers = PostsControllers;
exports.PostsControllers = PostsControllers = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [postQueryRepository_1.PostsQueryRepository,
        commentsServices_1.CommentsServices,
        commentsQueryRepository_1.CommentsQueryRepository,
        postsServices_1.PostsServices])
], PostsControllers);
