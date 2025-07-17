import { validationResult } from "express-validator";
import { User } from "../../schemas/user.js";
import bcrypt from "bcryptjs";
import CustomBadRequestError from "../../errors/customBadRequestError.js";

export async function checkEmail(req, res, next) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new CustomBadRequestError(JSON.stringify(errors.array()));
	}

	const { email } = req.body;

	try {
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

export async function createUser(req, res, next) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new CustomBadRequestError(JSON.stringify(errors.array()));
	}

	const { email, name, password } = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		// const newUser = new User({
		// 	email,
		// 	name,
		// 	password: hashedPassword,
		// 	authProviders: ["email"],
		// });

		// await newUser.save();

		// const newProject = new Project({
		// 	owner: newUser._id,
		// });

		// await newProject.save();

		// newUser.projects.push(newProject._id);
		// await newUser.save();

		const populatedUser = await User.findById(newUser._id).populate("projects");

		return res.status(201).json({
			statusCode: 201,
			message: "User created successfully.",
			user: populatedUser,
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
}
