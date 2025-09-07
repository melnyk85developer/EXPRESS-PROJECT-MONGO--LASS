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
exports.PostsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
const db_1 = require("../../../db");
let PostsQueryRepository = class PostsQueryRepository {
    constructor(mongoDB) {
        this.mongoDB = mongoDB;
    }
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
                const posts = yield this.mongoDB.postsCollection
                    .find(filter)
                    .sort({ [sortBy]: sortDirectionValue, _id: 1 })
                    .skip((pageNumber - 1) * pageSize)
                    .limit(pageSize)
                    .toArray();
                return yield this._arrPostsMapForRender(sanitizedQuery, posts, totalCount);
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    getPostByIdRepositories(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('getPostByIdRepositories - req id', id)
            try {
                const getPost = yield this.mongoDB.postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                // console.log('getPostByIdRepositories - res getPost ', getPost)
                if (getPost) {
                    return yield this._postsMapForRender(getPost);
                }
            }
            catch (error) {
                return error;
            }
        });
    }
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
                return yield this.mongoDB.postsCollection.countDocuments(filter);
            }
            catch (e) {
                console.error(e);
                return 0;
            }
        });
    }
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
    }
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
};
exports.PostsQueryRepository = PostsQueryRepository;
exports.PostsQueryRepository = PostsQueryRepository = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)(db_1.MongoDBCollection)),
    __metadata("design:paramtypes", [db_1.MongoDBCollection])
], PostsQueryRepository);
