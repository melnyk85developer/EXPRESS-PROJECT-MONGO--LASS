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
exports.BlogsQueryRepository = void 0;
require("reflect-metadata");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
// import { blogsCollection } from "../../../db";
const db_1 = require("../../../db");
let BlogsQueryRepository = class BlogsQueryRepository {
    constructor(
    // @inject(TYPES.MongoDBCollection)
    mongoDB) {
        this.mongoDB = mongoDB;
    }
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
                const blogs = yield this.mongoDB.blogsCollection
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
                    const foundBlog = yield this.mongoDB.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
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
                return yield this.mongoDB.blogsCollection.countDocuments(filter);
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
};
exports.BlogsQueryRepository = BlogsQueryRepository;
exports.BlogsQueryRepository = BlogsQueryRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [db_1.MongoDBCollection])
], BlogsQueryRepository);
