import { body, query } from 'express-validator';

export const confirmEmailMiddlewares = [
    query('code')
        .notEmpty()
        .withMessage('Код активации не должен быть пустым!')
        .isString()
        .withMessage('Код активации должен быть строкой!')
        .trim()
        .isUUID()
        .withMessage('Код активации должен быть валидным UUID!')
]
export const registrationConfirmationMiddlewares = [
    body('code')
        .notEmpty()
        .withMessage('Код активации не должен быть пустым!')
        .isString()
        .withMessage('Код активации должен быть строкой!')
        .trim()
        .isUUID()
        .withMessage('Код активации должен быть валидным UUID!'),

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