import CustomBadRequestError from "../errors/customBadRequestError.js";
import { User } from "../schemas/user.js";
import { Project } from "../schemas/project.js";
import CustomNotFoundError from "../errors/customNotFoundError.js";
import mongoose from "mongoose";
import { verifyRequestBody } from "../middlewares/guards.js";
import {
	findUser,
	findUserByProjectId,
	findUserProjects,
} from "../utils/lib.js";

export async function createProject(req, res, next) {
	try {
		verifyRequestBody(req);

		const { name, whitelistedDomain } = req.body;
		const { accountId: _id } = req.params;

		const user = await findUser(_id);

		if (user.projects.length >= user.projectLimit) {
			throw new CustomBadRequestError("Project limit reached for this account");
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

		const user = await findUserProjects(_id);

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
	try {
		verifyRequestBody(req);

		const { name, devMode, whitelistedDomain } = req.body;
		const { accountId: _id, projectId } = req.params;

		const user = await findUserByProjectId(_id, projectId);

		const updatedProject = await Project.findOneAndUpdate(
			{ _id: projectId, owner: user._id },
			{ name, devMode, whitelistedDomain },
			{ new: true }
		);

		if (!updatedProject) {
			throw new CustomNotFoundError(
				"Project not found or could not be updated"
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

		const user = await findUserByProjectId(_id, projectId);

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
