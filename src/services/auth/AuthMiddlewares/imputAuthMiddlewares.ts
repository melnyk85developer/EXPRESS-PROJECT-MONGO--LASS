import { body } from 'express-validator';

export const inputMiddlewares = [
    body('loginOrEmail')
        .notEmpty()
        .isString()
        .trim()
        .isLength({min: 3, max: 50})
        .withMessage('Минимум 3, максимум 30 символов!'),
    body('password')
        .notEmpty()
        .isString()
        .trim()
        .isLength({min: 3, max: 30})
        .withMessage('Минимум 3, максимум 30 символов!')
]