import { User } from "../schemas/user.js";
import { Project } from "../schemas/project.js";
import CustomBadRequestError from "../errors/customBadRequestError.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendOnboardingEmail } from "../services/emailService.js";
import { verifyRequestBody } from "../middlewares/guards.js";

export const generateToken = async (req, res, next) => {
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
		next(error);
	}
};

export async function validateEmail(req, res, next) {
	try {
		verifyRequestBody(req);

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
	try {
		verifyRequestBody(req);

		const { verificationToken } = req.query;
		const { password } = req.body;

		if (!verificationToken) {
			throw new CustomBadRequestError("Verification token is missing.");
		}

		const user = await User.findOne({ verificationToken });

		user;

		if (!user) {
			throw new CustomBadRequestError("Invalid or expired verification token.");
		}

		user.isVerified = true;
		user.verificationToken = null;
		user.password = password;

		await user.save();

		const newProject = new Project({
			owner: user._id,
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

export async function validateSignIn(req, res, next) {
	try {
		verifyRequestBody(req);

		next();
	} catch (error) {
		console.error(error);
		return next(error);
	}
}
