import { body } from 'express-validator';

export const blogMiddlewares = [    
    body('name')
        .notEmpty()
        .isString()
        .trim()
        .isLength({ min: 1, max: 19 })
        .withMessage('Минимум 3, максимум 10 символов!'),
    body('websiteUrl')
        .isURL()
        .withMessage('Вы прислали не реальный адрес сайта!')
        .trim()
        .isLength({ min: 1, max: 1000 })
        .withMessage('Превышен лимит символов для адреса сайта!'),
    body('description')
        .notEmpty()
        .isString()
        .trim()
        .isLength({min: 3, max: 3000})
        .withMessage('Минимум 3, максимум 3000 символов!'),
]