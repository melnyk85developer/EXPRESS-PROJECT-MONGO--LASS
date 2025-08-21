import { body, param } from 'express-validator';

export const commentsMiddleware = [
    body('content')
        .notEmpty()
        .withMessage('Не корректные данные для обновления комментария!')
        .isString()
        .trim()
        .isLength({min: 20, max: 300})
        .withMessage('Минимум 3, максимум 300 символов!')
]