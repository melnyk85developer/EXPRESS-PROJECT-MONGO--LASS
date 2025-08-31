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
exports.postOneBlogMiddlewares = exports.postMiddlewares = void 0;
const express_validator_1 = require("express-validator");
const blogQueryRepository_1 = require("../../blogs/BlogsRepository/blogQueryRepository");
const iocRoot_1 = require("../../../shared/container/iocRoot");
const blogsQueryRepository = iocRoot_1.container.get(blogQueryRepository_1.BlogsQueryRepository);
exports.postMiddlewares = [
    (0, express_validator_1.body)('blogId')
        .notEmpty()
        .isString()
        .custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
        const blog = yield blogsQueryRepository.getBlogByIdRepository(blogId);
        if (!blog) {
            throw new Error('Блога с таким blogId не найденно!');
        }
    })),
    (0, express_validator_1.body)('title')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Минимум 3, максимум 30 символов!'),
    (0, express_validator_1.body)('shortDescription')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Минимум 3, максимум 100 символов!'),
    (0, express_validator_1.body)('content')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 3, max: 1000 })
        .withMessage('Минимум 3, максимум 1000 символов!'),
];
exports.postOneBlogMiddlewares = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Минимум 3, максимум 30 символов!'),
    (0, express_validator_1.body)('shortDescription')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Минимум 3, максимум 100 символов!'),
    (0, express_validator_1.body)('content')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 3, max: 1000 })
        .withMessage('Минимум 3, максимум 1000 символов!'),
];
