"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogMiddlewares = exports.updateBlogMiddlewares = exports.postBlogIdOnePostMiddlewares = exports.postBlogMiddlewares = exports.getBlogIdMiddlewares = exports.getBlogIdAllPostsMiddlewares = exports.getBlogsMiddlewares = void 0;
// ;import { authMiddlewares, blogValidationMiddlewares } from "../../../shared/container/compositionRootCustom";
// import { container } from "../../../shared/container/iocRoot";
const compositionRootCustom_1 = require("../../../shared/container/compositionRootCustom");
const input_validation_middleware_1 = require("../../../shared/middlewares/input-validation-middleware");
const postMiddlewares_1 = require("../../posts/PostMiddlewares/postMiddlewares");
const blogMiddlewares_1 = require("./blogMiddlewares");
// const authMiddlewares: AuthMiddlewares = container.resolve(AuthMiddlewares)
// const blogValidationMiddlewares: BlogValidationMiddlewares = container.resolve(BlogValidationMiddlewares)
exports.getBlogsMiddlewares = [
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getBlogIdAllPostsMiddlewares = [
    compositionRootCustom_1.blogValidationMiddlewares.isBlogIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getBlogIdMiddlewares = [
    compositionRootCustom_1.blogValidationMiddlewares.blogIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postBlogMiddlewares = [
    compositionRootCustom_1.authMiddlewares.oldAuthGuardMiddleware,
    ...blogMiddlewares_1.blogMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postBlogIdOnePostMiddlewares = [
    compositionRootCustom_1.authMiddlewares.oldAuthGuardMiddleware,
    compositionRootCustom_1.blogValidationMiddlewares.isBlogIdMiddleware,
    ...postMiddlewares_1.postOneBlogMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.updateBlogMiddlewares = [
    compositionRootCustom_1.authMiddlewares.oldAuthGuardMiddleware,
    compositionRootCustom_1.blogValidationMiddlewares.blogIdMiddleware,
    ...blogMiddlewares_1.blogMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware
];
exports.deleteBlogMiddlewares = [
    compositionRootCustom_1.authMiddlewares.oldAuthGuardMiddleware,
    compositionRootCustom_1.blogValidationMiddlewares.blogIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
