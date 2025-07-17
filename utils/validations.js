import { body } from "express-validator";

export const validateEmail = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Email is invalid"),
];
