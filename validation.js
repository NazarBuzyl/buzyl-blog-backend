import { body } from "express-validator";

export const loginValidation = [
  body("email", "Incorrect email format").isEmail(),
  body("password", "Password schould have minimum 5 symbols").isLength({
    min: 8,
  }),
];

export const registerValidator = [
  body("email", "Incorrect email format").isEmail(),
  body("password", "Password schould have minimum 5 symbols").isLength({
    min: 8,
  }),
  body("fullName", "Write your name").isLength({ min: 3 }),
  body("avatarUrl", "Incorrect photos url").optional().isURL(),
];

export const postCreateValidation = [
  body("title", "Write title for post").isLength({ min: 3 }).isString(),
  body("text", "Write text for post").isLength({ min: 3 }).isString(),
  body("tags", "Incorrect tags format").optional().isString(),
  body("imageUrl", "Incorrect photos url").optional().isString(),
];
