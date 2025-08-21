"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogMiddlewares = exports.updateBlogMiddlewares = exports.postBlogIdOnePostMiddlewares = exports.postBlogMiddlewares = exports.getBlogIdMiddlewares = exports.getBlogIdAllPostsMiddlewares = exports.getBlogsMiddlewares = void 0;
const input_validation_middleware_1 = require("../../../middlewares/input-validation-middleware");
const authGuardMiddleware_1 = require("../../auth/AuthMiddlewares/authGuardMiddleware");
const postMiddlewares_1 = require("../../posts/PostMiddlewares/postMiddlewares");
const blogMiddlewares_1 = require("./blogMiddlewares");
const isThereABlogValidation_1 = require("./isThereABlogValidation");
exports.getBlogsMiddlewares = [
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getBlogIdAllPostsMiddlewares = [
    isThereABlogValidation_1.isBlogIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getBlogIdMiddlewares = [
    isThereABlogValidation_1.blogIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postBlogMiddlewares = [
    authGuardMiddleware_1.oldAuthGuardMiddleware,
    ...blogMiddlewares_1.blogMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postBlogIdOnePostMiddlewares = [
    authGuardMiddleware_1.oldAuthGuardMiddleware,
    isThereABlogValidation_1.isBlogIdMiddleware,
    ...postMiddlewares_1.postOneBlogMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.updateBlogMiddlewares = [
    authGuardMiddleware_1.oldAuthGuardMiddleware,
    isThereABlogValidation_1.blogIdMiddleware,
    ...blogMiddlewares_1.blogMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.deleteBlogMiddlewares = [
    authGuardMiddleware_1.oldAuthGuardMiddleware,
    isThereABlogValidation_1.blogIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
