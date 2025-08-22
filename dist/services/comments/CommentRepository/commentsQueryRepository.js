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
exports.commentsQueryRepository = exports.CommentsQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../../db");
class CommentsQueryRepository {
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
                const comments = yield db_1.commentsCollection
                    .find(filter)
                    .sort({ [sortBy]: sortDirectionValue, _id: 1 })
                    .skip((pageNumber - 1) * pageSize)
                    .limit(pageSize)
                    .toArray();
                const isComments = yield exports.commentsQueryRepository._arrCommentsMapForRender(sanitizedQuery, comments, totalCount);
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
                const getComment = yield db_1.commentsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (getComment) {
                    return yield exports.commentsQueryRepository._commentsMapForRender(getComment);
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
                return yield db_1.commentsCollection.countDocuments(filter);
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
}
exports.CommentsQueryRepository = CommentsQueryRepository;
exports.commentsQueryRepository = new CommentsQueryRepository();
