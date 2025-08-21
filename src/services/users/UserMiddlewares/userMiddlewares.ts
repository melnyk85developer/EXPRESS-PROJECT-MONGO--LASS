import { body } from 'express-validator';

export const userMiddlewares = [
    body('login')
        .notEmpty()
        .isString()
        .trim()
        .isLength({min: 3, max: 10})
        .withMessage('Минимум 3, максимум 10 символов!'),
    body('password')
        .notEmpty()
        .withMessage('Password не может быть пустой строкой!')
        .isString()
        .withMessage('password должен быть строкой!')
        .trim()
        .isLength({min: 6, max: 20})
        .withMessage('Минимум 6, максимум 20 символов!'),
    body('email')
        .notEmpty()
        .withMessage('Email не может быть пустой строкой!')
        .isString()
        .trim()
        .isEmail()
        .withMessage('Не корректный Email!')
        .isLength({min: 3, max: 100})
        .withMessage('Минимум 3, максимум 100 символов!'),
]