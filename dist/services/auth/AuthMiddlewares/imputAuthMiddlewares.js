"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputMiddlewares = void 0;
const express_validator_1 = require("express-validator");
exports.inputMiddlewares = [
    (0, express_validator_1.body)('loginOrEmail')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Минимум 3, максимум 30 символов!'),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Минимум 3, максимум 30 символов!')
];
