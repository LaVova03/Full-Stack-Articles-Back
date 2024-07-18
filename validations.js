import { body } from "express-validator";

export const loginValidation = [
    body('email', 'Ну верный формат почты').isEmail(),
    body('password', 'Ну верный формат пароля').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'Ну верный формат почты').isEmail(),
    body('password', 'Ну верный формат пароля').isLength({ min: 5 }),
    body('fullName', 'Ну верный формат имени').isLength({ min: 3 }),
    body('avatarUrl', 'Ну верный формат url на аватарку').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
    body('text', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'Неверные теги').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]