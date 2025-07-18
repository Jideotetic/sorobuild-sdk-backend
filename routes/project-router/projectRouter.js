/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - projectId
 *       properties:
 *         projectId:
 *           type: string
 *           description: Unique ID for the project
 *         name:
 *           type: string
 *           description: Name of the project
 *         devMode:
 *           type: boolean
 *           description: Whether the project is in developer mode
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the project was created
 *       example:
 *         projectId: 123e4567-e89b-12d3-a456-426614174000
 *         name: Default Project
 *         devMode: true
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
 *       - bearerAuth: []
 *     parameters:
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
 *       - bearerAuth: []
 *     parameters:
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
 *       - bearerAuth: []
 *     parameters:
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
 *       401:
 *         description: Unauthorized request
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

import { Router } from "express";
import {
	createProjectSchema,
	updateProjectSchema,
} from "../../utils/validations.js";
import {
	createProject,
	fetchAllUserProjects,
	updateProject,
} from "../../controllers/project-controller/projectController.js";

const projectRouter = Router();

projectRouter.post("/:accountId", createProjectSchema, createProject);

projectRouter.get("/:accountId", fetchAllUserProjects);

projectRouter.put("/:accountId/:projectId", updateProjectSchema, updateProject);

export default projectRouter;
