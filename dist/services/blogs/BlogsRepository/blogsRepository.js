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
exports.blogsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_1 = require("../../../db");
exports.blogsRepository = {
    createBlogRepository(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.blogsCollection.insertOne(blog);
            }
            catch (error) {
                // console.error(error)
                return error;
            }
        });
    },
    updateBlogRepository(id, blog) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedBlog = yield db_1.blogsCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                    $set: {
                        name: blog.name,
                        description: blog.description,
                        websiteUrl: blog.websiteUrl
                    }
                });
                return updatedBlog;
            }
            catch (error) {
                // console.error(error)
                return error;
            }
        });
    },
    deleteBlogRepository(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.blogsCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            }
            catch (error) {
                // console.error(error)
                return error;
            }
        });
    }
};
