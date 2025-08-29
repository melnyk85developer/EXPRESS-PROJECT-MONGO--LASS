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
exports.CommentsQueryRepository = void 0;
require("reflect-metadata");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
let CommentsQueryRepository = (() => {
    let _classDecorators = [(0, inversify_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CommentsQueryRepository = _classThis = class {
        constructor(
        // @inject(TYPES.MongoDBCollection)
        mongoDB) {
            this.mongoDB = mongoDB;
        }
        getAllCommentssRepository(postId, query) {
            return __awaiter(this, void 0, void 0, function* () {
                // console.log('getAllCommentssRepository: - postId, query', postId, query)
                const sanitizedQuery = yield this._helper(query);
                const totalCount = yield this._getCommentsCount(sanitizedQuery, postId);
                const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = sanitizedQuery;
                const sortDirectionValue = sortDirection === 'asc' ? 1 : -1;
                try {
                    const filter = { postId };
                    if (searchNameTerm) {
                        filter.content = { $regex: searchNameTerm, $options: 'i' };
                    }
                    const comments = yield this.mongoDB.commentsCollection
                        .find(filter)
                        .sort({ [sortBy]: sortDirectionValue, _id: 1 })
                        .skip((pageNumber - 1) * pageSize)
                        .limit(pageSize)
                        .toArray();
                    const isComments = yield this._arrCommentsMapForRender(sanitizedQuery, comments, totalCount);
                    ;
                    // console.log('getAllCommentssRepository: - isComments', isComments)
                    if (isComments && isComments !== undefined) {
                        // console.log('getAllCommentssRepository: - isComments', isComments)
                        return isComments;
                    }
                    else {
                        return null;
                    }
                }
                catch (e) {
                    console.error(e);
                    return null;
                }
            });
        }
        getCommentByIdRepository(id) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const getComment = yield this.mongoDB.commentsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                    if (getComment) {
                        return yield this._commentsMapForRender(getComment);
                    }
                }
                catch (error) {
                    // console.error(error)
                    return error;
                }
            });
        }
        _getCommentsCount(sanitizedQuery, postId) {
            return __awaiter(this, void 0, void 0, function* () {
                const filter = {};
                const { searchNameTerm } = sanitizedQuery;
                if (postId) {
                    filter.postId = postId;
                }
                if (searchNameTerm) {
                    filter.content = { $regex: searchNameTerm, $options: 'i' };
                }
                try {
                    return yield this.mongoDB.commentsCollection.countDocuments(filter);
                }
                catch (e) {
                    console.error(e);
                    return 0;
                }
            });
        }
        _commentsMapForRender(comment) {
            return __awaiter(this, void 0, void 0, function* () {
                const { _id, content, commentatorInfo, createdAt } = comment;
                return {
                    id: _id,
                    content,
                    commentatorInfo,
                    createdAt,
                };
            });
        }
        _arrCommentsMapForRender(sanitizedQuery, arrComment, totalCount) {
            return __awaiter(this, void 0, void 0, function* () {
                const resComments = [];
                for (let i = 0; i < arrComment.length; i++) {
                    let comment = yield this._commentsMapForRender(arrComment[i]);
                    resComments.push(comment);
                }
                return {
                    pagesCount: Math.ceil(totalCount / sanitizedQuery.pageSize),
                    page: sanitizedQuery.pageNumber,
                    pageSize: sanitizedQuery.pageSize,
                    totalCount,
                    items: resComments
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
    __setFunctionName(_classThis, "CommentsQueryRepository");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommentsQueryRepository = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommentsQueryRepository = _classThis;
})();
exports.CommentsQueryRepository = CommentsQueryRepository;
