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
exports.postsRepository = exports.PostsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../../db");
class PostsRepository {
    createPostRepository(post) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.postsCollection.insertOne(post);
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    updatePostRepository(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedPost = yield db_1.postsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                    $set: {
                        title: body.title,
                        shortDescription: body.shortDescription,
                        content: body.content
                    }
                });
                return updatedPost;
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
    deletePostRepository(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('deletePostRepository: - res ', id)
            try {
                return yield db_1.postsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            }
            catch (e) {
                console.error(e);
                return null;
            }
        });
    }
}
exports.PostsRepository = PostsRepository;
exports.postsRepository = new PostsRepository();
