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
exports.BlogsQueryRepository = void 0;
require("reflect-metadata");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
let BlogsQueryRepository = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var BlogsQueryRepository = _classThis = class {
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
    __setFunctionName(_classThis, "BlogsQueryRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        BlogsQueryRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return BlogsQueryRepository = _classThis;
})();
exports.BlogsQueryRepository = BlogsQueryRepository;
