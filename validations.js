import { body } from 'express-validator'

export const registerValidation = [
    body("email", "Невірний формат пошти").isEmail(),
    body("password", "Пароль повинен містити мінімум 5 символів").isLength({ min: 5 }),
    body("fullName", "Вкажіть ім'я").isLength({ min: 2 }),
    body("avatarUrl", "Невірне посилання на аватар").optional().isURL(),
]

export const loginValidation = [
    body("email", "Невірний формат електронної пошти").isEmail(),
    body("password", "Пароль повинен містити мінімум 5 символів").isLength({ min: 5 }),
]

export const postCreateValidation = [
    body("title", "Введіть заголовок статті").isString().isLength({ min: 5 }).notEmpty(),
    body("text", "Введіть текст статті").isString().isLength({ min: 10 }).notEmpty(),
    body("tags", "Невірний формат тегів (вкажіть масив)").optional().isString(),
    body("imageUrl", "Невірне посилання на зображення").optional().isString,
]
