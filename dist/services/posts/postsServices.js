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
exports.postsServices = exports.PostsServices = void 0;
const postsRepository_1 = require("./PostRepository/postsRepository");
const blogQueryRepository_1 = require("../blogs/BlogsRepository/blogQueryRepository");
const commentsRepository_1 = require("../comments/CommentRepository/commentsRepository");
const commentsQueryRepository_1 = require("../comments/CommentRepository/commentsQueryRepository");
class PostsServices {
    createPostServices(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, shortDescription, content, blogId } = post;
            const date = new Date();
            // date.setMilliseconds(0);
            const createdAt = date.toISOString();
            const isIdBlog = yield blogQueryRepository_1.blogsQueryRepository.getBlogByIdRepository(blogId);
            const createPost = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: isIdBlog.name,
                createdAt: createdAt
            };
            return yield postsRepository_1.postsRepository.createPostRepository(createPost);
        });
    }
    createPostOneBlogServices(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blogId } = req.params;
            const { title, shortDescription, content } = req.body;
            const date = new Date();
            // date.setMilliseconds(0);
            const createdAt = date.toISOString();
            const isIdBlog = yield blogQueryRepository_1.blogsQueryRepository.getBlogByIdRepository(blogId);
            const createPost = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: isIdBlog.name,
                createdAt: createdAt
            };
            return yield postsRepository_1.postsRepository.createPostRepository(createPost);
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
            return yield postsRepository_1.postsRepository.updatePostRepository(id, updatedPost);
        });
    }
    deletePostServices(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('deletePostServices: - req id', id)
            const isComments = yield commentsQueryRepository_1.commentsQueryRepository.getAllCommentssRepository(id, '');
            // console.log('deletePostServices deleteAllComments: - req id, isComments', id, isComments)
            // if(isComments && isComments.items.length > 0){
            // console.log('deleteAllComments: - res id, isComments', id, isComments)
            const commsntExists = yield commentsRepository_1.commentsRepository.deleteAllCommentsFromPostRepository(id);
            // console.log('deleteAllComments: - res ', id, commsntExists)
            // }
            return yield postsRepository_1.postsRepository.deletePostRepository(id);
        });
    }
}
exports.PostsServices = PostsServices;
exports.postsServices = new PostsServices();
