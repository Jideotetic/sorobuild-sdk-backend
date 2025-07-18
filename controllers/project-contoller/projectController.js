import { validationResult } from "express-validator";
import CustomBadRequestError from "../../errors/customBadRequestError.js";
import { User } from "../../schemas/user.js";
import { Project } from "../../schemas/project.js";

export async function createProject(req, res, next) {
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			throw new CustomBadRequestError(JSON.stringify(errors.array()));
		}

		const { name } = req.body;
		const { accountId: _id } = req.params;

		if (!_id) {
			throw new CustomBadRequestError(JSON.stringify("Account ID missing"));
		}

		const user = await User.findOne({ _id });

		if (!user) {
			throw new CustomBadRequestError(JSON.stringify("User not found"));
		}

		if (user.projects.length >= user.projectLimit) {
			throw new CustomBadRequestError(
				JSON.stringify("Project limit reached for this account")
			);
		}

		const newProject = new Project({
			owner: user._id,
			name,
		});

		await newProject.save();

		user.projects.push(newProject._id);

		await user.save();

		res.status(201).json({
			statusCode: 201,
			message: "Project created successfully",
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
}
