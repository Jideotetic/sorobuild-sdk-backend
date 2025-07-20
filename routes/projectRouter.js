/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Project ID
 *         name:
 *           type: string
 *           description: Name of the project
 *         whitelistedDomain:
 *           type: string
 *           description: Domain allowed to use this project
 *         projectKey:
 *           type: string
 *           description: Unique key to identify a project
 *         devMode:
 *           type: boolean
 *           description: Whether the project is in development mode
 *         owner:
 *           type: string
 *           description: ID of user account that owns the project
 *         createdAt:
 *           type: string
 *           description: Timestamp when the project was created
 *       example:
 *         _id: 687a03c9399764f331370f96
 *         name: Default Project
 *         whitelistedDomain: https://example.com
 *         devMode: true
 *         owner: 687a03c9399764f331370f96
 *         createdAt: 2025-07-16T12:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Project
 *   description: Project management APIs
 */

/**
 * @swagger
 * /project/{accountId}:
 *   post:
 *     summary: Create a new project
 *     tags: [Project]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: header
 *         name: idToken
 *         schema:
 *           type: string
 *         required: true
 *         description: ID token
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID (_id) of the account to which the project belongs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Default Project"
 *               whitelistedDomain:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Project created successfully
 *                 project:
 *                   type: object
 *                   example:
 *                    _id: 687a03c9399764f331370f96
 *                    name: Default Project
 *                    whitelistedDomain: https://example.com
 *                    projectKey: 687a03c9399764f331370f96
 *                    devMode: true
 *                    owner: 687a03c9399764f331370f96
 *                    createdAt: 2025-07-16T12:00:00.000Z
 *       401:
 *         description: Unauthorized request
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /project:
 *   get:
 *     summary: Get all projects
 *     tags: [Project]
 *     security:
 *        - Authorization: []
 *     parameters:
 *       - in: header
 *         name: idToken
 *         schema:
 *           type: string
 *         required: true
 *         description: ID token
 *       - in: query
 *         name: start
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of projects to return
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Project fetched successfully
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized request
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /project/{accountId}:
 *   get:
 *     summary: Get all projects link to an account
 *     tags: [Project]
 *     security:
 *        - Authorization: []
 *     parameters:
 *       - in: header
 *         name: idToken
 *         schema:
 *           type: string
 *         required: true
 *         description: ID token
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID (_id) of the account to which the project belongs
 *     responses:
 *       200:
 *         description: Project fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Project fetched successfully
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized request
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /project/{accountId}/{projectId}:
 *   put:
 *     summary: Update a project
 *     tags: [Project]
 *     security:
 *        - Authorization: []
 *     parameters:
 *       - in: header
 *         name: idToken
 *         schema:
 *           type: string
 *         required: true
 *         description: ID token
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID (_id) of the account to which the project belongs
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               devMode:
 *                 type: boolean
 *               whitelistedDomain:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Project updated successfully
 *                 project:
 *                   type: object
 *                   example:
 *                    _id: 687a03c9399764f331370f96
 *                    name: Default Project
 *                    whitelistedDomain: https://example.com
 *                    devMode: true
 *                    owner: 687a03c9399764f331370f96
 *                    createdAt: 2025-07-16T12:00:00.000Z
 *       401:
 *         description: Unauthorized request
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /project/{accountId}/{projectId}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Project]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: header
 *         name: idToken
 *         schema:
 *           type: string
 *         required: true
 *         description: ID token
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID (_id) of the account to which the project belongs
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the project
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Project deleted successfully
 *       401:
 *         description: Unauthorized request
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

import { Router } from "express";
import {
	createProjectPayloadValidation,
	updateProjectPayloadValidation,
} from "../middlewares/validations.js";
import {
	createProject,
	deleteProject,
	fetchAllProjects,
	fetchAllUserProjects,
	updateProject,
} from "../controllers/projectController.js";

const projectRouter = Router();

projectRouter.post(
	"/:accountId",
	createProjectPayloadValidation,
	createProject
);

projectRouter.get("/", fetchAllProjects);

projectRouter.get("/:accountId", fetchAllUserProjects);

projectRouter.put(
	"/:accountId/:projectId",
	updateProjectPayloadValidation,
	updateProject
);

projectRouter.delete("/:accountId/:projectId", deleteProject);

export default projectRouter;
