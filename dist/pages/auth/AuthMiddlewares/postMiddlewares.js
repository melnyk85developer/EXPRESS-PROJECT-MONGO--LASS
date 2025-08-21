"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registrationConfirmationMiddlewares = exports.confirmEmailMiddlewares = void 0;
const express_validator_1 = require("express-validator");
exports.confirmEmailMiddlewares = [
    (0, express_validator_1.query)('code')
        .notEmpty()
        .withMessage('Код активации не должен быть пустым!')
        .isString()
        .withMessage('Код активации должен быть строкой!')
        .trim()
        .isUUID()
        .withMessage('Код активации должен быть валидным UUID!')
];
exports.registrationConfirmationMiddlewares = [
    (0, express_validator_1.body)('code')
        .notEmpty()
        .withMessage('Код активации не должен быть пустым!')
        .isString()
        .withMessage('Код активации должен быть строкой!')
        .trim()
        .isUUID()
        .withMessage('Код активации должен быть валидным UUID!'),
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage('Email не может быть пустой строкой!')
        .isString()
        .trim()
        .isEmail()
        .withMessage('Не корректный Email!')
        .isLength({ min: 3, max: 100 })
        .withMessage('Минимум 3, максимум 100 символов!'),
];
