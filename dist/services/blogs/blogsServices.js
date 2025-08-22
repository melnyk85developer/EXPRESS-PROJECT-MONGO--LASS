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
exports.blogsServices = exports.BlogsServices = void 0;
const blogsRepository_1 = require("./BlogsRepository/blogsRepository");
class BlogsServices {
    createBlogServices(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, websiteUrl } = blog;
            const date = new Date();
            // date.setMilliseconds(0);
            const createdAt = date.toISOString();
            const createBlog = {
                name: name,
                description: description,
                websiteUrl: websiteUrl,
                createdAt: createdAt,
                isMembership: false
            };
            return yield blogsRepository_1.blogsRepository.createBlogRepository(createBlog);
        });
    }
    updateBlogServices(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedBlog = {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            };
            return yield blogsRepository_1.blogsRepository.updateBlogRepository(id, updatedBlog);
        });
    }
    deleteBlogServices(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield blogsRepository_1.blogsRepository.deleteBlogRepository(id);
        });
    }
}
exports.BlogsServices = BlogsServices;
exports.blogsServices = new BlogsServices();
