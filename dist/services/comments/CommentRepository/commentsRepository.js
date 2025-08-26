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
exports.CommentsRepository = void 0;
require("reflect-metadata");
const mongodb_1 = require("mongodb");
const inversify_1 = require("inversify");
// import { commentsCollection } from "../../../db";
const db_1 = require("../../../db");
let CommentsRepository = class CommentsRepository {
    constructor(
    // @inject(TYPES.MongoDBCollection)
    mongoDB) {
        this.mongoDB = mongoDB;
    }
    createCommentRepository(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.mongoDB.commentsCollection.insertOne(comment);
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
                const updatedComment = yield this.mongoDB.commentsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
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
                const deleteComment = yield this.mongoDB.commentsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
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
                const getComment = yield this.mongoDB.commentsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
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
                const deleteComments = yield this.mongoDB.commentsCollection.deleteMany({ postId: new mongodb_1.ObjectId(postId) });
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
};
exports.CommentsRepository = CommentsRepository;
exports.CommentsRepository = CommentsRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [db_1.MongoDBCollection])
], CommentsRepository);
