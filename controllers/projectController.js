import { Project } from "../schemas/project.js";
import CustomNotFoundError from "../errors/customNotFoundError.js";
import { verifyRequestBody } from "../middlewares/guards.js";
import {
	decryptProjectId,
	encryptProjectId,
	findUser,
	findUserByProjectId,
	findUserProjects,
	formatProjectForResponse,
} from "../utils/lib.js";
import { v4 as uuidv4 } from "uuid";
import CustomForbiddenError from "../errors/customForbiddenError.js";

export async function createProject(req, res, next) {
	try {
		verifyRequestBody(req);

		const { name, whitelistedDomain } = req.body;
		const incomingUser = req.user;

		const user = await findUser(incomingUser.id);

		if (user.projects.length >= user.projectLimit) {
			throw new CustomForbiddenError("Project limit reached for this account");
		}

		const randomizedId = Math.floor(1000 + Math.random() * 9000);

		const newProject = new Project({
			owner: user._id,
			name,
			whitelistedDomain,
			randomId: randomizedId,
		});

		await newProject.save();

		const rawProjectId = `${user._id}_${randomizedId}_${newProject._id}`;

		newProject.projectId = rawProjectId;
		await newProject.save();

		user.projects.push(newProject._id);
		await user.save();

		const safeProject = formatProjectForResponse(newProject);

		res.status(201).json({
			statusCode: 201,
			message: "Project created successfully",
			project: safeProject,
		});
	} catch (error) {
		return next(error);
	}
}

export async function fetchAllUserProjects(req, res, next) {
	try {
		const { accountId: _id } = req.params;
		const incomingUser = req.user;

		const user = await findUserProjects(incomingUser.id);

		const cleanedProjects = user.projects.map(formatProjectForResponse);

		res.status(200).json({
			statusCode: 200,
			message: "User projects fetched successfully",
			projects: cleanedProjects,
		});
	} catch (error) {
		return next(error);
	}
}

export async function updateProject(req, res, next) {
	try {
		verifyRequestBody(req);

		const { name, devMode, whitelistedDomain } = req.body;

		const { projectId } = req.params;

		const [accountId, randomizedId, projectIdToken] = projectId.split("_");

		const { user, project } = await findUserByProjectId(
			accountId,
			projectIdToken,
			randomizedId
		);

		const updatedProject = await Project.findOneAndUpdate(
			{ _id: project._id, owner: user._id },
			{ name, devMode, whitelistedDomain },
			{ new: true }
		);

		if (!updatedProject) {
			throw new CustomNotFoundError(
				"Project not found or could not be updated"
			);
		}

		const safeProject = formatProjectForResponse(updatedProject);

		res.status(200).json({
			statusCode: 200,
			message: "Project updated successfully",
			project: safeProject,
		});
	} catch (error) {
		return next(error);
	}
}

export async function deleteProject(req, res, next) {
	try {
		const { projectId } = req.params;

		const [accountId, randomizedId, projectIdToken] = projectId.split("_");

		const { user, project } = await findUserByProjectId(
			accountId,
			projectIdToken,
			randomizedId
		);

		const deletedProject = await Project.findOneAndDelete({
			_id: project._id,
			owner: user._id,
		});

		if (!deletedProject) {
			throw new CustomNotFoundError("Project not found or already deleted");
		}

		user.projects = user.projects.filter(
			(pId) => pId.toString() !== project._id
		);

		await user.save();

		res.status(200).json({
			statusCode: 200,
			message: "Project deleted successfully",
		});
	} catch (error) {
		return next(error);
	}
}
