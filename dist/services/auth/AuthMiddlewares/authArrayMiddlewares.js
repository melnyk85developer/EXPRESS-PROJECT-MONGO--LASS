"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meMiddlewares = exports.registrationEmailResendingMiddlewares = exports.registrationConfirmMiddlewares = exports.confirmationEmailMiddlewares = exports.refreshTokenMiddlewares = exports.logoutMiddlewares = exports.loginMiddlewares = exports.registrationMiddlewares = void 0;
// import { authMiddlewares } from "../../../shared/container/compositionRootCustom";
// import { container } from "../../../shared/container/iocRoot";
const compositionRootCustom_1 = require("../../../shared/container/compositionRootCustom");
const input_validation_middleware_1 = require("../../../shared/input-validation-middleware");
const userMiddlewares_1 = require("../../users/UserMiddlewares/userMiddlewares");
const imputAuthMiddlewares_1 = require("./imputAuthMiddlewares");
const postMiddlewares_1 = require("./postMiddlewares");
// const authMiddlewares: AuthMiddlewares = container.resolve(AuthMiddlewares)
exports.registrationMiddlewares = [
    ...userMiddlewares_1.userMiddlewares, // Распаковываем массив, если это ValidationChain[]
    input_validation_middleware_1.inputValidationMiddleware, // Одиночный middleware
];
exports.loginMiddlewares = [
    ...imputAuthMiddlewares_1.inputMiddlewares, // Распаковываем массив
    compositionRootCustom_1.authMiddlewares.authLoginMiddleware, // Одиночный middleware
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.logoutMiddlewares = [
    compositionRootCustom_1.authMiddlewares.refreshTokenMiddleware, // Одиночный middleware
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.refreshTokenMiddlewares = [
    compositionRootCustom_1.authMiddlewares.refreshTokenMiddleware, // Одиночный middleware
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.confirmationEmailMiddlewares = [
    ...postMiddlewares_1.confirmEmailMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.registrationConfirmMiddlewares = [
    ...postMiddlewares_1.registrationConfirmationMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.registrationEmailResendingMiddlewares = [
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.meMiddlewares = [
    compositionRootCustom_1.authMiddlewares.accessTokenMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
