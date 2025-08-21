"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogMiddlewares = void 0;
const express_validator_1 = require("express-validator");
exports.blogMiddlewares = [
    (0, express_validator_1.body)('name')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 1, max: 19 })
        .withMessage('Минимум 3, максимум 10 символов!'),
    (0, express_validator_1.body)('websiteUrl')
        .isURL()
        .withMessage('Вы прислали не реальный адрес сайта!')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Превышен лимит символов для адреса сайта!'),
    (0, express_validator_1.body)('description')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 3, max: 3000 })
        .withMessage('Минимум 3, максимум 3000 символов!'),
];
