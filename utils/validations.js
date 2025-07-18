import { body } from "express-validator";
import validator from "validator";

export const emailPayloadSchema = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Email is invalid")
		.custom((value) => {
			const blockedEmails = ["string"];
			if (blockedEmails.includes(value.toLowerCase())) {
				throw new Error("Email is required");
			}
			return true;
		}),
];

export const signUpPayloadSchema = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Email is invalid")
		.custom((value) => {
			const blockedEmails = ["string"];
			if (blockedEmails.includes(value.toLowerCase())) {
				throw new Error("Email is required");
			}
			return true;
		}),

	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.custom((value) => {
			const blockedName = ["string"];
			if (blockedName.includes(value.toLowerCase())) {
				throw new Error("Name is required");
			}
			return true;
		}),

	body("password")
		.trim()
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters")
		.custom((value) => {
			const blockedPassword = ["string"];
			if (blockedPassword.includes(value.toLowerCase())) {
				throw new Error("Password is required");
			}
			return true;
		}),
];

export const signInPayloadSchema = [
	body("email")
		.trim()
		.notEmpty()
		.withMessage("Email is required")
		.isEmail()
		.withMessage("Email is invalid")
		.custom((value) => {
			const blockedEmails = ["string"];
			if (blockedEmails.includes(value.toLowerCase())) {
				throw new Error("Email is required");
			}
			return true;
		}),

	body("password")
		.trim()
		.notEmpty()
		.withMessage("Password is required")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters")
		.custom((value) => {
			const blockedPassword = ["string"];
			if (blockedPassword.includes(value.toLowerCase())) {
				throw new Error("Password is required");
			}
			return true;
		}),
];

export const createProjectSchema = [
	body("name").trim().notEmpty().withMessage("Name is required"),

	body("whitelistedDomain")
		.optional({ checkFalsy: true })
		.trim()
		.custom((value) => {
			if (!validator.isURL(value, { require_protocol: true })) {
				throw new Error(
					"Must be a valid URL including protocol (http or https)"
				);
			}
			return true;
		}),
];

export const updateProjectSchema = [
	body("name")
		.trim()
		.notEmpty()
		.withMessage("Name is required")
		.custom((value) => {
			const blockedEmails = ["string"];
			if (blockedEmails.includes(value.toLowerCase())) {
				throw new Error("Name is required");
			}
			return true;
		}),

	body("whitelistedDomain")
		.optional({ checkFalsy: true })
		.trim()
		.custom((value) => {
			if (!validator.isURL(value, { require_protocol: true })) {
				throw new Error(
					"Must be a valid URL including protocol (http or https)"
				);
			}

			return true;
		}),

	body("devMode")
		.optional()
		.isBoolean()
		.withMessage("devMode must be a boolean"),
];
