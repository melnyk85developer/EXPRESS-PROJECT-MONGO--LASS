"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserMiddlewares = exports.updateUserMiddlewares = exports.postUserMiddlewares = exports.getUserByIdMiddlewares = exports.getAllUsersMiddlewares = void 0;
const compositionRootCustom_1 = require("../../../shared/container/compositionRootCustom");
// import { container } from "../../../shared/container/iocRoot";
const input_validation_middleware_1 = require("../../../shared/middlewares/input-validation-middleware");
const userMiddlewares_1 = require("./userMiddlewares");
// const usersMiddlewares: UsersMiddlewares = container.resolve(UsersMiddlewares)
// const authMiddlewares: AuthMiddlewares = container.resolve(AuthMiddlewares)
exports.getAllUsersMiddlewares = [
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.getUserByIdMiddlewares = [
    compositionRootCustom_1.usersMiddlewares.userIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.postUserMiddlewares = [
    compositionRootCustom_1.authMiddlewares.oldAuthGuardMiddleware,
    ...userMiddlewares_1.userMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.updateUserMiddlewares = [
    compositionRootCustom_1.authMiddlewares.oldAuthGuardMiddleware,
    compositionRootCustom_1.usersMiddlewares.userIdMiddleware,
    ...userMiddlewares_1.userMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.deleteUserMiddlewares = [
    compositionRootCustom_1.authMiddlewares.oldAuthGuardMiddleware,
    compositionRootCustom_1.usersMiddlewares.userIdMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
