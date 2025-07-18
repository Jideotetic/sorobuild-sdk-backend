import { validationResult } from "express-validator";
import { User } from "../../schemas/user.js";
import CustomBadRequestError from "../../errors/customBadRequestError.js";
import passport from "passport";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import CustomNotFoundError from "../../errors/customNotFoundError.js";
import CustomUnauthorizedError from "../../errors/customUnauthorizedError.js";

export const generateToken = async (req, res, next) => {
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			throw new CustomBadRequestError(JSON.stringify(errors.array()));
		}

		const { api_id, api_key } = req.body;

		console.log({ api_id, api_key });

		if (api_id !== process.env.API_ID || api_key !== process.env.API_KEY) {
			throw new CustomBadRequestError(
				JSON.stringify("Invalid api credentials")
			);
		}

		const token = jwt.sign(
			{
				type: "app_user",
				api_id,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		return res.status(200).json({
			statusCode: 200,
			message: "Token generated successfully",
			token,
		});
	} catch (error) {
		next(error);
	}
};

export const authenticateAppUser = (req, res, next) => {
	passport.authenticate("app-jwt", { session: false }, (err, type, info) => {
		if (err || !type) {
			const message = info?.message || "Unauthorized";
			return next(new CustomUnauthorizedError(JSON.stringify(message)));
		}
		req.type = type;
		next();
	})(req, res, next);
};

export async function validateEmailPayload(req, res, next) {
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			throw new CustomBadRequestError(JSON.stringify(errors.array()));
		}

		const { email } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(200).json({
				statusCode: 200,
				message: "User exist, Prompt for password.",
				email: email,
				userExists: true,
				nextAction: "REQUEST_PASSWORD",
			});
		} else {
			return res.status(200).json({
				statusCode: 200,
				message: "User not found, Proceed to onboarding.",
				email: email,
				userExists: false,
				nextAction: "ONBOARD_NEW_USER",
			});
		}
	} catch (error) {
		console.error(error);
		return next(error);
	}
}

export async function validateSignUpPayload(req, res, next) {
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			throw new CustomBadRequestError(JSON.stringify(errors.array()));
		}

		next();
	} catch (error) {
		console.error(error);
		return next(error);
	}
}

export async function validateSignInPayload(req, res, next) {
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			throw new CustomBadRequestError(JSON.stringify(errors.array()));
		}

		next();
	} catch (error) {
		console.error(error);
		return next(error);
	}
}

export async function handleAuthCallback(
	req,
	res,
	next,
	err,
	user,
	info,
	statusCode
) {
	if (err || !user) {
		const message = info.message || "Authentication failed";
		if (message === "No user found ...Kindly sign up") {
			return next(new CustomNotFoundError(JSON.stringify(message)));
		} else if (
			message === "Wrong password" ||
			message === "User already exist...Kindly sign in"
		) {
			return next(new CustomBadRequestError(JSON.stringify(message)));
		}
	}

	try {
		await promisify(req.login).bind(req)(user, { session: false });

		const JWT_SECRET = process.env.JWT_SECRET;

		const body = { ...user };
		const token = jwt.sign({ user: body }, JWT_SECRET, {
			expiresIn: "24h",
		});

		const userObj = user.toObject();
		delete userObj.password;

		return res.status(statusCode).json({
			statusCode,
			message: info?.message || "Success",
			user: { ...userObj, token },
		});
	} catch (error) {
		return next(error);
	}
}

export function passportAuthHandler(strategyName, statusCode) {
	return (req, res, next) => {
		// Calls the passport middleware for sign up /middlewares/passport.js
		passport.authenticate(strategyName, (err, user, info) => {
			handleAuthCallback(req, res, next, err, user, info, statusCode);
		})(req, res, next);
	};
}
