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
exports.CommentsQueryRepository = void 0;
require("reflect-metadata");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
// import { commentsCollection } from "../../../db";
const db_1 = require("../../../db");
let CommentsQueryRepository = class CommentsQueryRepository {
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
exports.CommentsQueryRepository = CommentsQueryRepository;
exports.CommentsQueryRepository = CommentsQueryRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [db_1.MongoDBCollection])
], CommentsQueryRepository);
