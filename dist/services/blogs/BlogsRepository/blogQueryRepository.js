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
exports.blogsQueryRepository = exports.BlogsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../../db");
class BlogsQueryRepository {
    getAllBlogsRepository(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const sanitizedQuery = yield this._helper(req.query);
            const totalCount = yield this._getBlogsCount(sanitizedQuery);
            const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = sanitizedQuery;
            const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;
            const filter = {};
            try {
                if (searchNameTerm) {
                    filter.name = { $regex: searchNameTerm, $options: 'i' };
                }
                const blogs = yield db_1.blogsCollection
                    .find(filter)
                    .sort({ [sortBy]: sortDirectionValue, _id: 1 })
                    .skip((pageNumber - 1) * pageSize)
                    .limit(pageSize)
                    .toArray();
                const blogss = yield this._arrBlogsMapForRender(sanitizedQuery, blogs, totalCount);
                // console.log('blogsControllers: - getAllBlogsRepository', blogss)
                return blogss;
            }
            catch (error) {
                // console.error(error)
                return error;
            }
        });
    }
    getBlogByIdRepository(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (id) {
                    const foundBlog = yield db_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                    if (foundBlog) {
                        return yield this._blogMapForRender(foundBlog);
                    }
                }
                return null;
            }
            catch (error) {
                // console.error(error)
                return error;
            }
        });
    }
    _getBlogsCount(sanitizedQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            const { searchNameTerm } = sanitizedQuery;
            if (searchNameTerm) {
                filter.name = { $regex: searchNameTerm, $options: 'i' };
            }
            try {
                return yield db_1.blogsCollection.countDocuments(filter);
            }
            catch (e) {
                console.error(e);
                return 0;
            }
        });
    }
    _blogMapForRender(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                id: String(blog._id),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership
            };
        });
    }
    _arrBlogsMapForRender(sanitizedQuery, arrBlog, totalCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const resBlogs = [];
            for (let i = 0; arrBlog.length > i; i++) {
                let post = yield this._blogMapForRender(arrBlog[i]);
                resBlogs.push(post);
            }
            return {
                pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount,
                items: resBlogs
            };
        });
    }
    _helper(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                pageNumber: query.pageNumber ? +query.pageNumber : 1,
                pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
                sortBy: query.sortBy ? query.sortBy : 'createdAt',
                sortDirection: query.sortDirection ? query.sortDirection : 'desc',
                searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
            };
        });
    }
}
exports.BlogsQueryRepository = BlogsQueryRepository;
exports.blogsQueryRepository = new BlogsQueryRepository();
