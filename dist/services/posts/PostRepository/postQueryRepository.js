"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsQueryRepository = void 0;
require("reflect-metadata");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
let PostsQueryRepository = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var PostsQueryRepository = _classThis = class {
        constructor(
        // @inject(TYPES.MongoDBCollection)
        mongoDB) {
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
                // console.log('getPostByIdRepositories - ', id)
                try {
                    const getPost = yield this.mongoDB.postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                    // console.log('getPostByIdRepositories - res ', getPost)
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
    __setFunctionName(_classThis, "PostsQueryRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PostsQueryRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PostsQueryRepository = _classThis;
})();
exports.PostsQueryRepository = PostsQueryRepository;
