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
exports.postsControllers = void 0;
const express_1 = __importDefault(require("express"));
const utils_1 = require("../../utils/utils");
const postQueryRepository_1 = require("./PostRepository/postQueryRepository");
const postsServices_1 = require("./postsServices");
const commentsServices_1 = require("../comments/commentsServices");
const commentsQueryRepository_1 = require("../comments/CommentRepository/commentsQueryRepository");
const SuccessfulResponse_1 = require("../../utils/SuccessfulResponse");
const ErResSwitch_1 = require("../../utils/ErResSwitch");
const postArrayMiddlewares_1 = require("./PostMiddlewares/postArrayMiddlewares");
const postsControllers = () => {
    const router = express_1.default.Router();
    router.get('/', postArrayMiddlewares_1.getAllPostMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, yield postQueryRepository_1.postsQueryRepository.getAllPostsRepositories(req));
    }));
    router.get('/:id', postArrayMiddlewares_1.getPostIdMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const foundPost = yield postQueryRepository_1.postsQueryRepository.getPostByIdRepositories(req.params.id);
        if (foundPost && foundPost.id) {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, foundPost);
        }
        else {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, 0, foundPost);
        }
    }));
    router.post('/', postArrayMiddlewares_1.postPostMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const createPost = yield postsServices_1.postsServices.createPostServices(req.body);
        if (createPost && createPost.acknowledged) {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_POST, undefined, yield postQueryRepository_1.postsQueryRepository.getPostByIdRepositories(createPost.insertedId));
        }
        else {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_NO_BLOG_TO_CREATE_THIS_POST);
        }
    }));
    router.get('/:postId/comments', postArrayMiddlewares_1.getPostIdAllCommentsMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const foundPost = yield postQueryRepository_1.postsQueryRepository.getPostByIdRepositories(req.params.postId);
        if (foundPost.id) {
            const comments = yield commentsQueryRepository_1.commentsQueryRepository.getAllCommentssRepository(req.params.postId, req.query);
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS, undefined, comments);
        }
        else {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_NO_POST_FOR_THIS_COMMENTS);
        }
    }));
    router.post('/:postId/comments', postArrayMiddlewares_1.postPostIdCommentsMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const createCommentOnePost = yield commentsServices_1.commentsServices.createCommentOnePostServices(req);
        if (createCommentOnePost && createCommentOnePost.acknowledged) {
            const foundComment = yield commentsQueryRepository_1.commentsQueryRepository.getCommentByIdRepository(createCommentOnePost.insertedId);
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_CREATED_COMMENT, undefined, foundComment);
        }
        else {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, 0, 'При получении созданого комментария произошла не известная ошибка!');
        }
    }));
    router.put('/:id', postArrayMiddlewares_1.updatePostMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const updatePost = yield postsServices_1.postsServices.updatePostServices(req.params.id, req.body);
        if (updatePost && updatePost.acknowledged) {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_UPDATED_POST);
        }
        else {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_UPDATED_POST);
        }
    }));
    router.delete('/:id', postArrayMiddlewares_1.deletePostMiddlewares, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const isDeletedPost = yield postsServices_1.postsServices.deletePostServices(req.params.id);
        if (isDeletedPost && isDeletedPost.acknowledged) {
            return (0, SuccessfulResponse_1.SuccessfulResponse)(res, utils_1.INTERNAL_STATUS_CODE.SUCCESS_DELETED_POST);
        }
        else {
            return (0, ErResSwitch_1.ResErrorsSwitch)(res, utils_1.INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_DELETED_POST);
        }
    }));
    return router;
};
exports.postsControllers = postsControllers;
