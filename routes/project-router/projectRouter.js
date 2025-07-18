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
import { Router } from "express";
import { createProjectSchema } from "../../utils/validations.js";
import { createProject } from "../../controllers/project-contoller/projectController.js";

const projectRouter = Router();

projectRouter.post("/:accountId", createProjectSchema, createProject);

projectRouter.get("/:accountId", () => {});

export default projectRouter;
