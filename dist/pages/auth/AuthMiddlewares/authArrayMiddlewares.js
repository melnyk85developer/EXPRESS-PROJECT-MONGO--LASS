"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meMiddlewares = exports.registrationEmailResendingMiddlewares = exports.registrationConfirmMiddlewares = exports.confirmationEmailMiddlewares = exports.refreshTokenMiddlewares = exports.logoutMiddlewares = exports.loginMiddlewares = exports.registrationMiddlewares = void 0;
const input_validation_middleware_1 = require("../../../middlewares/input-validation-middleware");
const userMiddlewares_1 = require("../../users/UserMiddlewares/userMiddlewares");
const authGuardMiddleware_1 = require("./authGuardMiddleware");
const imputAuthMiddlewares_1 = require("./imputAuthMiddlewares");
const postMiddlewares_1 = require("./postMiddlewares");
exports.registrationMiddlewares = [
    ...userMiddlewares_1.userMiddlewares, // Распаковываем массив, если это ValidationChain[]
    input_validation_middleware_1.inputValidationMiddleware, // Одиночный middleware
];
exports.loginMiddlewares = [
    ...imputAuthMiddlewares_1.inputMiddlewares, // Распаковываем массив
    authGuardMiddleware_1.authLoginMiddleware, // Одиночный middleware
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.logoutMiddlewares = [
    authGuardMiddleware_1.refreshTokenMiddleware, // Одиночный middleware
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.refreshTokenMiddlewares = [
    authGuardMiddleware_1.refreshTokenMiddleware, // Одиночный middleware
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
    authGuardMiddleware_1.accessTokenMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
