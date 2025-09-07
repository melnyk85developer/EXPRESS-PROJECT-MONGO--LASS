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
exports.PostsControllers = void 0;
const utils_1 = require("../../shared/utils/utils");
const ErRes_1 = require("../../shared/utils/ErRes");
const inversify_1 = require("inversify");
const postQueryRepository_1 = require("./PostRepository/postQueryRepository");
const commentsServices_1 = require("../comments/commentsServices");
const commentsQueryRepository_1 = require("../comments/CommentRepository/commentsQueryRepository");
const postsServices_1 = require("./postsServices");
const SuccessResponse_1 = require("../../shared/utils/SuccessResponse");
let PostsControllers = class PostsControllers {
    constructor(postsQueryRepository, commentsServices, commentsQueryRepository, postsServices) {
        this.postsQueryRepository = postsQueryRepository;
        this.commentsServices = commentsServices;
        this.commentsQueryRepository = commentsQueryRepository;
        this.postsServices = postsServices;
    }
    getAllPostsController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS, yield this.postsQueryRepository.getAllPostsRepositories(req), undefined, req, res);
        });
    }
    getPostByIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield this.postsQueryRepository.getPostByIdRepositories(req.params.id);
            if (foundPost && foundPost.id) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS, foundPost, undefined, undefined, res);
            }
            else {
                return new ErRes_1.ErRes(foundPost, undefined, undefined, req, res);
            }
        });
    }
    createPostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createPost = yield this.postsServices.createPostServices(req.body);
            if (createPost && createPost.acknowledged) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST, yield this.postsQueryRepository.getPostByIdRepositories(createPost.insertedId), undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_NO_BLOG_TO_CREATE_THIS_POST, undefined, undefined, req, res);
            }
        });
    }
    getAllCommentsByPostIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundPost = yield this.postsQueryRepository.getPostByIdRepositories(req.params.postId);
            if (foundPost.id) {
                const comments = yield this.commentsQueryRepository.getAllCommentssRepository(req.params.postId, req.query);
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS, comments, undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_NO_POST_FOR_THIS_COMMENTS, undefined, undefined, req, res);
            }
        });
    }
    createCommentByPostIdController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createCommentOnePost = yield this.commentsServices.createCommentOnePostServices(req);
            // console.log('createCommentByPostIdController: createCommentOnePost', createCommentOnePost)
            if (createCommentOnePost && createCommentOnePost.acknowledged) {
                const foundComment = yield this.commentsQueryRepository.getCommentByIdRepository(createCommentOnePost.insertedId);
                // console.log('createCommentByPostIdController: foundComment', foundComment)
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_COMMENT, foundComment, undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST, undefined, 'При получении созданого комментария произошла не известная ошибка!', req, res);
            }
        });
    }
    updatePostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatePost = yield this.postsServices.updatePostServices(req.params.id, req.body);
            if (updatePost && updatePost.acknowledged) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_POST, undefined, undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_UPDATED_POST, undefined, undefined, req, res);
            }
        });
    }
    deletePostController(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const isDeletedPost = yield this.postsServices.deletePostServices(req.params.id);
            if (isDeletedPost && isDeletedPost.acknowledged) {
                return (0, SuccessResponse_1.SuccessResponse)(utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_POST, undefined, undefined, req, res);
            }
            else {
                return new ErRes_1.ErRes(utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_POST, undefined, undefined, req, res);
            }
        });
    }
};
exports.PostsControllers = PostsControllers;
exports.PostsControllers = PostsControllers = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(postQueryRepository_1.PostsQueryRepository)),
    __param(1, (0, inversify_1.inject)(commentsServices_1.CommentsServices)),
    __param(2, (0, inversify_1.inject)(commentsQueryRepository_1.CommentsQueryRepository)),
    __param(3, (0, inversify_1.inject)(postsServices_1.PostsServices)),
    __metadata("design:paramtypes", [postQueryRepository_1.PostsQueryRepository,
        commentsServices_1.CommentsServices,
        commentsQueryRepository_1.CommentsQueryRepository,
        postsServices_1.PostsServices])
], PostsControllers);
