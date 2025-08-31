"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogMiddlewares = exports.updateBlogMiddlewares = exports.postBlogIdOnePostMiddlewares = exports.postBlogMiddlewares = exports.getBlogIdMiddlewares = exports.getBlogIdAllPostsMiddlewares = exports.getBlogsMiddlewares = void 0;
const iocRoot_1 = require("../../../shared/container/iocRoot");
const input_validation_middleware_1 = require("../../../shared/middlewares/input-validation-middleware");
const authGuardMiddleware_1 = require("../../auth/AuthMiddlewares/authGuardMiddleware");
const postMiddlewares_1 = require("../../posts/PostMiddlewares/postMiddlewares");
const blogMiddlewares_1 = require("./blogMiddlewares");
const isThereABlogValidation_1 = require("./isThereABlogValidation");
const authMiddlewares = iocRoot_1.container.get(authGuardMiddleware_1.AuthMiddlewares);
const blogValidationMiddlewares = iocRoot_1.container.get(isThereABlogValidation_1.BlogValidationMiddlewares);
exports.getBlogsMiddlewares = [
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getBlogIdAllPostsMiddlewares = [
    blogValidationMiddlewares.isBlogIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getBlogIdMiddlewares = [
    blogValidationMiddlewares.blogIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postBlogMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    ...blogMiddlewares_1.blogMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postBlogIdOnePostMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    blogValidationMiddlewares.isBlogIdMiddleware,
    ...postMiddlewares_1.postOneBlogMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.updateBlogMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    blogValidationMiddlewares.blogIdMiddleware,
    ...blogMiddlewares_1.blogMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.deleteBlogMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    blogValidationMiddlewares.blogIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
