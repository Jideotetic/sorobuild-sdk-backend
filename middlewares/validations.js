import { body } from "express-validator";
import validator from "validator";

export const emailPayloadValidation = [
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

export const passwordPayloadValidation = [
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

export const signInPayloadValidation = [
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

export const generateTokenPayloadValidation = [
	body("api_id")
		.trim()
		.notEmpty()
		.withMessage("api_id is required")
		.custom((value) => {
			const blockedApiId = ["string"];
			if (blockedApiId.includes(value.toLowerCase())) {
				throw new Error("api_id is required");
			}
			return true;
		}),

	body("api_key")
		.trim()
		.notEmpty()
		.withMessage("api_key is required")
		.custom((value) => {
			const blockedPassword = ["string"];
			if (blockedPassword.includes(value.toLowerCase())) {
				throw new Error("api_key is required");
			}
			return true;
		}),
];

export const createProjectPayloadValidation = [
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

export const updateProjectPayloadValidation = [
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

export const rpcCreditsPayloadValidation = [
	body("rpcCredits")
		.notEmpty()
		.withMessage("rpcCredits is required")
		.isInt({ gt: 0 })
		.withMessage("rpcCredits must be greater than 0"),
];
