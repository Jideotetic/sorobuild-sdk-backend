import { validationResult } from "express-validator";
import CustomBadRequestError from "../../errors/customBadRequestError.js";
import { User } from "../../schemas/user.js";
import { Project } from "../../schemas/project.js";
import CustomNotFoundError from "../../errors/customNotFoundError.js";
import mongoose from "mongoose";

export async function createProject(req, res, next) {
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			throw new CustomBadRequestError(JSON.stringify(errors.array()));
		}

		const { name, whitelistedDomain } = req.body;
		const { accountId: _id } = req.params;

		if (!_id) {
			throw new CustomBadRequestError(JSON.stringify("Account ID missing"));
		}

		if (!mongoose.Types.ObjectId.isValid(_id)) {
			throw new CustomBadRequestError(
				JSON.stringify("Invalid accountId")
			);
		}

		const user = await User.findOne({ _id });

		if (!user) {
			throw new CustomBadRequestError(
				JSON.stringify("User not found with the provided account ID")
			);
		}

		if (user.projects.length >= user.projectLimit) {
			throw new CustomBadRequestError(
				JSON.stringify("Project limit reached for this account")
			);
		}

		const newProject = new Project({
			owner: user._id,
			name,
			whitelistedDomain,
		});

		await newProject.save();

		user.projects.push(newProject._id);

		await user.save();

		res.status(201).json({
			statusCode: 201,
			message: "Project created successfully",
			project: newProject,
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
}

export async function fetchAllUserProjects(req, res, next) {
	try {
		const { accountId: _id } = req.params;

		if (!_id) {
			throw new CustomBadRequestError(JSON.stringify("Account ID missing"));
		}

		if (!mongoose.Types.ObjectId.isValid(_id)) {
			throw new CustomBadRequestError(
				JSON.stringify("Invalid accountId")
			);
		}

		const user = await User.findOne({ _id }).populate("projects");

		if (!user) {
			throw new CustomNotFoundError(
				JSON.stringify("User not found with the provided account ID")
			);
		}

		res.status(200).json({
			statusCode: 200,
			message: "User projects fetched successfully",
			projects: user.projects,
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
}

export async function updateProject(req, res, next) {
	const errors = validationResult(req);

	try {
		if (!errors.isEmpty()) {
			throw new CustomBadRequestError(JSON.stringify(errors.array()));
		}

		const { name, devMode, whitelistedDomain } = req.body;
		const { accountId: _id, projectId } = req.params;

		if (!_id || !projectId) {
			throw new CustomBadRequestError(
				JSON.stringify("Account ID or Project ID missing")
			);
		}

		if (!mongoose.Types.ObjectId.isValid(_id)) {
			throw new CustomBadRequestError(
				JSON.stringify("Invalid accountId")
			);
		}

		if (!mongoose.Types.ObjectId.isValid(projectId)) {
			throw new CustomBadRequestError(
				JSON.stringify("Invalid projectId format")
			);
		}

		const user = await User.findOne({ _id });

		if (!user) {
			throw new CustomNotFoundError(
				JSON.stringify("User not found with the provided account ID")
			);
		}

		if (!user.projects.includes(projectId)) {
			throw new CustomBadRequestError(
				JSON.stringify("This project does not belong to the user")
			);
		}
		const updatedProject = await Project.findOneAndUpdate(
			{ _id: projectId, owner: user._id },
			{ name, devMode },
			{ new: true }
		);

		if (!updatedProject) {
			throw new CustomNotFoundError(
				JSON.stringify("Project not found or could not be updated")
			);
		}

		res.status(200).json({
			statusCode: 200,
			message: "Project updated successfully",
			project: updatedProject,
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
}

export async function deleteProject(req, res, next) {
	try {
		const { accountId: _id, projectId } = req.params;

		if (!_id || !projectId) {
			throw new CustomBadRequestError(
				JSON.stringify("Account ID or Project ID missing")
			);
		}

		if (!mongoose.Types.ObjectId.isValid(_id)) {
			throw new CustomBadRequestError(
				JSON.stringify("Invalid accountId")
			);
		}

		if (!mongoose.Types.ObjectId.isValid(projectId)) {
			throw new CustomBadRequestError(
				JSON.stringify("Invalid projectId format")
			);
		}

		const user = await User.findOne({ _id });

		if (!user) {
			throw new CustomNotFoundError(
				JSON.stringify("User not found with the provided account ID")
			);
		}

		if (!user.projects.includes(projectId)) {
			throw new CustomBadRequestError(
				JSON.stringify("This project does not belong to the user")
			);
		}

		const deletedProject = await Project.findOneAndDelete({
			_id: projectId,
			owner: user._id,
		});

		if (!deletedProject) {
			throw new CustomNotFoundError("Project not found or already deleted");
		}

		user.projects = user.projects.filter((pId) => pId.toString() !== projectId);

		await user.save();

		res.status(200).json({
			statusCode: 200,
			message: "Project deleted successfully",
		});
	} catch (error) {
		console.error(error);
		return next(error);
	}
}

export async function fetchAllProjects(req, res, next) {
	try {
		const start = parseInt(req.query.start) || 0;
		const limit = parseInt(req.query.limit) || 10;

		const projects = await Project.find()
			.skip(start)
			.limit(limit)
			.sort({ createdAt: -1 });

		const total = await Project.countDocuments();

		res.status(200).json({
			statusCode: 200,
			message: "Projects fetched successfully",
			projects,
			pagination: {
				start,
				limit,
				total,
				hasNextPage: start + limit < total,
			},
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
}
