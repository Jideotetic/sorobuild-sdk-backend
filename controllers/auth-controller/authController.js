import { validationResult } from "express-validator";
import { User } from "../../schemas/user.js";
import { Project } from "../../schemas/project.js";
import CustomBadRequestError from "../../errors/customBadRequestError.js";
import passport from "passport";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import CustomNotFoundError from "../../errors/customNotFoundError.js";
import crypto from "crypto";
import { sendOnboardingEmail } from "../../services/emailService.js";

export const generateToken = async (req, res, next) => {
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			throw new CustomBadRequestError(JSON.stringify(errors.array()));
		}

		const { api_id, api_key } = req.body;

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

export async function validateEmailPayload(req, res, next) {
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			throw new CustomBadRequestError(JSON.stringify(errors.array()));
		}

		const { email } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser && existingUser.isVerified) {
			return res.status(200).json({
				statusCode: 200,
				message: "User exist, Prompt for password.",
				email: email,
				userExists: true,
				nextAction: "REQUEST_PASSWORD",
			});
		}

		if (existingUser && !existingUser.isVerified) {
			return res.status(200).json({
				statusCode: 200,
				message:
					"User exist, Check the previous email that was sent to complete registration.",
				email: email,
				userExists: true,
				nextAction: "COMPLETE_EMAIL_VERIFICATION",
			});
		}

		const hash = crypto.createHash("sha256");
		hash.update(email + crypto.randomBytes(32).toString("hex"));
		const verificationToken = hash.digest("hex");

		// const newUser = new User({
		// 	email,
		// 	verificationToken,
		// 	authProviders: ["email"],
		// });
		// await newUser.save();

		await sendOnboardingEmail(email, verificationToken);

		return res.status(200).json({
			statusCode: 200,
			message: "Check your email to complete registration.",
			email,
			userExists: false,
			nextAction: "COMPLETE_EMAIL_VERIFICATION",
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
}

export async function verifyUser(req, res, next) {
	const errors = validationResult(req);
	try {
		if (!errors.isEmpty()) {
			throw new CustomBadRequestError(JSON.stringify(errors.array()));
		}

		const { verificationToken } = req.query;
		const { password } = req.body;

		if (!verificationToken) {
			throw new CustomBadRequestError(
				JSON.stringify("Verification token is missing.")
			);
		}

		const user = await User.findOne({ verificationToken });

		user;

		if (!user) {
			throw new CustomBadRequestError(
				JSON.stringify("Invalid or expired verification token.")
			);
		}

		user.isVerified = true;
		user.verificationToken = null;
		user.password = password;

		await user.save();

		const newProject = new Project({
			owner: user._id,
			whitelistedDomain: "",
		});

		await newProject.save();

		user.projects.push(newProject._id);
		await user.save();

		// Add email to request body to sign in user
		req.body.email = user.email;

		next();
	} catch (err) {
		console.error(err);
		next(err);
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
