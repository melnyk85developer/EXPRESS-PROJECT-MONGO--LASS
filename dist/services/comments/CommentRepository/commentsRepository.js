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
exports.commentsRepository = exports.CommentsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../../db");
class CommentsRepository {
    createCommentRepository(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.commentsCollection.insertOne(comment);
            }
            catch (error) {
                // console.error(error)
                return error;
            }
        });
    }
    updateCommentRepository(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedComment = yield db_1.commentsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                    $set: {
                        content: body.content
                    }
                });
                return updatedComment;
            }
            catch (error) {
                // console.error(error)
                return error;
            }
        });
    }
    deleteCommentRepository(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteComment = yield db_1.commentsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                if (deleteComment) {
                    return deleteComment;
                }
                else {
                    return 404;
                }
            }
            catch (error) {
                // console.error(e)
                return error;
            }
        });
    }
    _getCommentRepository(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getComment = yield db_1.commentsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                if (getComment) {
                    return getComment;
                }
            }
            catch (error) {
                // console.error(error)
                return error;
            }
        });
    }
    deleteAllCommentsFromPostRepository(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteComments = yield db_1.commentsCollection.deleteMany({ postId: new mongodb_1.ObjectId(postId) });
                if (deleteComments.deletedCount > 0) {
                    return deleteComments;
                }
                else {
                    // console.log('Комментарии для удаления не найдены.');
                    return 404; // Если нет комментариев для удаления, возвращаем 404
                }
            }
            catch (error) {
                // console.error(error);
                return error;
            }
        });
    }
}
exports.CommentsRepository = CommentsRepository;
exports.commentsRepository = new CommentsRepository();
