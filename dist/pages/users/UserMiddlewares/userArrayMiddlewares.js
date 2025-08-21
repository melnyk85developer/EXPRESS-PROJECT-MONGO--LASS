"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserMiddlewares = exports.updateUserMiddlewares = exports.postUserMiddlewares = exports.getUserByIdMiddlewares = exports.getAllUsersMiddlewares = void 0;
const input_validation_middleware_1 = require("../../../middlewares/input-validation-middleware");
const authGuardMiddleware_1 = require("../../auth/AuthMiddlewares/authGuardMiddleware");
const isThereAUserValidation_1 = require("./isThereAUserValidation");
const userMiddlewares_1 = require("./userMiddlewares");
exports.getAllUsersMiddlewares = [
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getUserByIdMiddlewares = [
    isThereAUserValidation_1.userIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postUserMiddlewares = [
    authGuardMiddleware_1.oldAuthGuardMiddleware,
    ...userMiddlewares_1.userMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.updateUserMiddlewares = [
    authGuardMiddleware_1.oldAuthGuardMiddleware,
    isThereAUserValidation_1.userIdMiddleware,
    ...userMiddlewares_1.userMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.deleteUserMiddlewares = [
    authGuardMiddleware_1.oldAuthGuardMiddleware,
    isThereAUserValidation_1.userIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
