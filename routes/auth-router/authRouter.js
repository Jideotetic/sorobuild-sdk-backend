/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - accountId
 *         - name
 *         - email
 *       properties:
 *         accountId:
 *           type: string
 *           description: Unique account ID (UUID)
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         authProviders:
 *           type: array
 *           items:
 *             type: string
 *             enum: [email, google, github, discord, wallet]
 *           description: Authentication methods linked to the account
 *         passwordHash:
 *           type: string
 *           nullable: true
 *           description: Hashed password, null if using OAuth
 *         googleId:
 *           type: string
 *           nullable: true
 *         githubId:
 *           type: string
 *           nullable: true
 *         discordId:
 *           type: string
 *           nullable: true
 *         rpcCredits:
 *           type: number
 *           default: 100000
 *           description: Available RPC credits
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'  # Define Project schema separately
 *           description: List of user projects (max 3)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *       example:
 *         accountId: 123e4567-e89b-12d3-a456-426614174000
 *         email: user@example.com
 *         authProviders: [email, google]
 *         passwordHash: $2b$10$somethinghashed
 *         googleId: "google-oauth-id"
 *         githubId: null
 *         discordId: null
 *         rpcCredits: 100000
 *         projects: []
 *         createdAt: 2025-07-16T15:00:00.000Z
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Project:
 *       type: object
 *       required:
 *         - projectId
 *         - whitelistedDomain
 *       properties:
 *         projectId:
 *           type: string
 *           description: Unique ID for the project
 *         name:
 *           type: string
 *           default: Default Project
 *           description: Name of the project
 *         whitelistedDomain:
 *           type: string
 *           format: hostname
 *           description: Domain allowed to use this project
 *         devMode:
 *           type: boolean
 *           default: true
 *           description: Whether the project is in developer mode
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the project was created
 *       example:
 *         projectId: abc123
 *         name: My First Project
 *         whitelistedDomain: example.com
 *         devMode: true
 *         createdAt: 2025-07-16T12:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with Email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Login with Google
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google login response
 */

import { Router } from "express";
import { body } from "express-validator";
import { getEmail } from "../../controllers/auth-controller/authController.js";

const authRouter = Router();

authRouter.post(
	"/login",
	body("email").isEmail().withMessage("Valid email required"),
	getEmail
);

authRouter.post("/google", (req, res) => {
	res.json(`Login with google`);
});

export default authRouter;
