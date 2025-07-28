import { User } from "../schemas/user.js";
import { Project } from "../schemas/project.js";
import CustomBadRequestError from "../errors/customBadRequestError.js";
import jwt from "jsonwebtoken";
import { sendOnboardingEmail } from "../services/emailService.js";
import { verifyRequestBody } from "../middlewares/guards.js";
import { encryptProjectId, generateVerificationToken } from "../utils/lib.js";
import { blacklistToken } from "../middlewares/blackListToken.js";
import CustomForbiddenError from "../errors/customForbiddenError.js";
import { v4 as uuidv4 } from "uuid";

export const generateAuthorizationToken = async (req, res, next) => {
	try {
		verifyRequestBody(req);

		const { api_id, api_key } = req.body;

		if (api_id !== process.env.API_ID || api_key !== process.env.API_KEY) {
			throw new CustomBadRequestError("Invalid api credentials");
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
		return next(error);
	}
};

export async function validateEmail(req, res, next) {
	try {
		verifyRequestBody(req);

		const { email } = req.body;

		const existingUser = await User.findOne({ email });

		if (existingUser && existingUser.authProviders.includes("google")) {
			throw new CustomForbiddenError(
				"Account already linked via google...kindly sign in with google"
			);
		}

		if (existingUser && existingUser.authProviders.includes("walletId")) {
			throw new CustomForbiddenError(
				"Account already linked via wallet...kindly sign in with wallet"
			);
		}

		if (existingUser && existingUser.authProviders.includes("github")) {
			throw new CustomForbiddenError(
				"Account already linked via github...kindly sign in with github"
			);
		}

		if (existingUser && existingUser.isVerified) {
			return res.status(200).json({
				statusCode: 200,
				message: "User exist, Prompt for password.",
				userExists: true,
				nextAction: "REQUEST_PASSWORD",
			});
		}

		if (existingUser && !existingUser.isVerified) {
			return res.status(200).json({
				statusCode: 200,
				message:
					"User exist, Check the previous email that was sent to complete registration.",
				userExists: true,
				nextAction: "COMPLETE_PREVIOUS_EMAIL_VERIFICATION",
			});
		}

		const verificationToken = generateVerificationToken(email);

		const newUser = new User({
			email,
			verificationToken,
			authProviders: ["email"],
		});
		await newUser.save();

		await sendOnboardingEmail(email, verificationToken);

		return res.status(200).json({
			statusCode: 200,
			message: "Check your email to complete registration.",
			userExists: false,
			nextAction: "COMPLETE_EMAIL_VERIFICATION",
		});
	} catch (error) {
		return next(error);
	}
}

export async function verifyUser(req, res, next) {
	try {
		verifyRequestBody(req);

		const { verificationToken } = req.query;
		const { password } = req.body;

		if (!verificationToken) {
			throw new CustomBadRequestError("Verification token is missing.");
		}

		const user = await User.findOne({ verificationToken });

		if (!user) {
			throw new CustomForbiddenError("Invalid or expired verification token.");
		}

		user.isVerified = true;
		user.verificationToken = null;
		user.password = password;

		await user.save();

		const randomizedId = Math.floor(1000 + Math.random() * 9000);

		const newProject = new Project({
			owner: user._id,
			randomId: randomizedId,
		});

		await newProject.save();

		const rawProjectId = `${user._id}_${randomizedId}_${newProject._id}`;

		newProject.projectId = rawProjectId;
		await newProject.save();

		user.projects.push(newProject._id);
		await user.save();

		// Add email to request body to sign in user
		req.body.email = user.email;

		next();
	} catch (error) {
		return next(error);
	}
}

export async function validateSignIn(req, res, next) {
	try {
		verifyRequestBody(req);

		const { email } = req.body;

		const user = await User.findOne({ email });

		if (!user.authProviders.includes("email")) {
			throw new CustomForbiddenError(
				"Account is not linked via email...try other sign in method"
			);
		}

		next();
	} catch (error) {
		return next(error);
	}
}

export async function signout(req, res, next) {
	try {
		// Blacklist token
		const token = req.token;
		const decoded = jwt.decode(token);
		const exp = decoded.exp;

		const now = Math.floor(Date.now() / 1000);
		const ttl = exp - now;

		if (ttl > 0) {
			await blacklistToken(token, ttl);
		}

		res.status(200).json({
			statusCode: 200,
			message: "User signed out successfully",
		});
	} catch (error) {
		return next(error);
	}
}
