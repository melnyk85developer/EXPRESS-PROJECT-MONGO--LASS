"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meMiddlewares = exports.registrationEmailResendingMiddlewares = exports.registrationConfirmMiddlewares = exports.confirmationEmailMiddlewares = exports.refreshTokenMiddlewares = exports.logoutMiddlewares = exports.loginMiddlewares = exports.registrationMiddlewares = void 0;
const iocRoot_1 = require("../../../shared/container/iocRoot");
const input_validation_middleware_1 = require("../../../shared/input-validation-middleware");
const userMiddlewares_1 = require("../../users/UserMiddlewares/userMiddlewares");
const authGuardMiddleware_1 = require("./authGuardMiddleware");
const imputAuthMiddlewares_1 = require("./imputAuthMiddlewares");
const postMiddlewares_1 = require("./postMiddlewares");
const authMiddlewares = iocRoot_1.container.get(authGuardMiddleware_1.AuthMiddlewares);
exports.registrationMiddlewares = [
    ...userMiddlewares_1.userMiddlewares,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.loginMiddlewares = [
    ...imputAuthMiddlewares_1.inputMiddlewares,
    authMiddlewares.authLoginMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.logoutMiddlewares = [
    authMiddlewares.refreshTokenMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
exports.refreshTokenMiddlewares = [
    authMiddlewares.refreshTokenMiddleware,
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
    authMiddlewares.accessTokenMiddleware,
    input_validation_middleware_1.inputValidationMiddleware,
];
