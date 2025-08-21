"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentsMiddleware = void 0;
const express_validator_1 = require("express-validator");
exports.commentsMiddleware = [
    (0, express_validator_1.body)('content')
        .notEmpty()
        .withMessage('Не корректные данные для обновления комментария!')
        .isString()
        .trim()
        .isLength({ min: 20, max: 300 })
        .withMessage('Минимум 3, максимум 300 символов!')
];
