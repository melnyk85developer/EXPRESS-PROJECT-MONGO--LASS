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
exports.postsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../../db");
exports.postsQueryRepository = {
    getAllPostsRepositories(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { blogId } = req.params;
            const sanitizedQuery = yield this._helper(req.query);
            const totalCount = yield this._getPostsCount(sanitizedQuery, blogId);
            const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = sanitizedQuery;
            const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;
            const filter = {};
            try {
                if (blogId) {
                    filter.blogId = blogId;
                }
                if (searchNameTerm) {
                    filter.title = { $regex: searchNameTerm, $options: 'i' };
                }
                const posts = yield db_1.postsCollection
                    .find(filter)
                    .sort({ [sortBy]: sortDirectionValue, _id: 1 })
                    .skip((pageNumber - 1) * pageSize)
                    .limit(pageSize)
                    .toArray();
                return yield exports.postsQueryRepository._arrPostsMapForRender(sanitizedQuery, posts, totalCount);
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    },
    getPostByIdRepositories(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('getPostByIdRepositories - ', id)
            try {
                const getPost = yield db_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                // console.log('getPostByIdRepositories - res ', getPost)
                if (getPost) {
                    return yield exports.postsQueryRepository._postsMapForRender(getPost);
                }
            }
            catch (error) {
                return error;
            }
        });
    },
    _getPostsCount(sanitizedQuery, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            const { searchNameTerm } = sanitizedQuery;
            if (blogId) {
                filter.blogId = blogId;
            }
            if (searchNameTerm) {
                filter.title = { $regex: searchNameTerm, $options: 'i' };
            }
            try {
                return yield db_1.postsCollection.countDocuments(filter);
            }
            catch (e) {
                console.error(e);
                return 0;
            }
        });
    },
    _postsMapForRender(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const { _id, title, shortDescription, content, blogId, blogName, createdAt } = post;
            return {
                id: _id,
                title,
                shortDescription,
                content,
                blogId,
                blogName,
                createdAt,
            };
        });
    },
    _arrPostsMapForRender(sanitizedQuery, arrPost, totalCount) {
        return __awaiter(this, void 0, void 0, function* () {
            const resPosts = [];
            for (let i = 0; i < arrPost.length; i++) {
                let post = yield this._postsMapForRender(arrPost[i]);
                resPosts.push(post);
            }
            return {
                pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
                page: sanitizedQuery.pageNumber,
                pageSize: sanitizedQuery.pageSize,
                totalCount,
                items: resPosts
            };
        });
    },
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
};
