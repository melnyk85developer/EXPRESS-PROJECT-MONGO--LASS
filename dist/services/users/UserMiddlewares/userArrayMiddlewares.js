"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserMiddlewares = exports.updateUserMiddlewares = exports.postUserMiddlewares = exports.getUserByIdMiddlewares = exports.getAllUsersMiddlewares = void 0;
const iocRoot_1 = require("../../../shared/container/iocRoot");
const input_validation_middleware_1 = require("../../../shared/middlewares/input-validation-middleware");
const authGuardMiddleware_1 = require("../../auth/AuthMiddlewares/authGuardMiddleware");
const isThereAUserValidation_1 = require("./isThereAUserValidation");
const userMiddlewares_1 = require("./userMiddlewares");
const usersMiddlewares = iocRoot_1.container.get(isThereAUserValidation_1.UsersMiddlewares);
const authMiddlewares = iocRoot_1.container.get(authGuardMiddleware_1.AuthMiddlewares);
exports.getAllUsersMiddlewares = [
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getUserByIdMiddlewares = [
    usersMiddlewares.userIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postUserMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    ...userMiddlewares_1.userMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.updateUserMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    usersMiddlewares.userIdMiddleware,
    ...userMiddlewares_1.userMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.deleteUserMiddlewares = [
    authMiddlewares.oldAuthGuardMiddleware,
    usersMiddlewares.userIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
