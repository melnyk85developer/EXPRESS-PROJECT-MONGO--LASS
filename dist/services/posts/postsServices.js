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
exports.PostsServices = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const blogQueryRepository_1 = require("../blogs/BlogsRepository/blogQueryRepository");
const commentsRepository_1 = require("../comments/CommentRepository/commentsRepository");
const commentsQueryRepository_1 = require("../comments/CommentRepository/commentsQueryRepository");
const postsRepository_1 = require("./PostRepository/postsRepository");
let PostsServices = class PostsServices {
    constructor(
    // @inject(TYPES.BlogsQueryRepository)
    blogsQueryRepository, 
    // @inject(TYPES.CommentsRepository)
    commentsRepository, 
    // @inject(TYPES.CommentsQueryRepository)
    commentsQueryRepository, 
    // @inject(TYPES.PostsRepository)
    postsRepository) {
        this.blogsQueryRepository = blogsQueryRepository;
        this.commentsRepository = commentsRepository;
        this.commentsQueryRepository = commentsQueryRepository;
        this.postsRepository = postsRepository;
    }
    createPostServices(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = post;
            const date = new Date();
            // date.setMilliseconds(0);
            const createdAt = date.toISOString();
            const isIdBlog = yield this.blogsQueryRepository.getBlogByIdRepository(blogId);
            const createPost = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: isIdBlog.name,
                createdAt: createdAt
            };
            return yield this.postsRepository.createPostRepository(createPost);
        });
    }
    createPostOneBlogServices(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blogId } = req.params;
            const { title, shortDescription, content } = req.body;
            const date = new Date();
            // date.setMilliseconds(0);
            const createdAt = date.toISOString();
            const isIdBlog = yield this.blogsQueryRepository.getBlogByIdRepository(blogId);
            const createPost = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: isIdBlog.name,
                createdAt: createdAt
            };
            return yield this.postsRepository.createPostRepository(createPost);
        });
    }
    updatePostServices(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedPost = {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId
            };
            return yield this.postsRepository.updatePostRepository(id, updatedPost);
        });
    }
    deletePostServices(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('deletePostServices: - req id', id)
            const isComments = yield this.commentsQueryRepository.getAllCommentssRepository(id, '');
            // console.log('deletePostServices deleteAllComments: - req id, isComments', id, isComments)
            // if(isComments && isComments.items.length > 0){
            // console.log('deleteAllComments: - res id, isComments', id, isComments)
            const commsntExists = yield this.commentsRepository.deleteAllCommentsFromPostRepository(id);
            // console.log('deleteAllComments: - res ', id, commsntExists)
            // }
            return yield this.postsRepository.deletePostRepository(id);
        });
    }
};
exports.PostsServices = PostsServices;
exports.PostsServices = PostsServices = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [blogQueryRepository_1.BlogsQueryRepository,
        commentsRepository_1.CommentsRepository,
        commentsQueryRepository_1.CommentsQueryRepository,
        postsRepository_1.PostsRepository])
], PostsServices);
