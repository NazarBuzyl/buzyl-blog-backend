import { body } from "express-validator";

export const loginValidation = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

export const registerValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  body("fullName").isLength({ min: 3 }),
  body("avatarUrl").optional().isURL(),
];
