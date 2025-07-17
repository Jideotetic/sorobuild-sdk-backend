/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - accountId
 *         - email
 *         - name
 *       properties:
 *         accountId:
 *           type: string
 *           description: Unique account ID (UUID)
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         name:
 *           type: string
 *           description: User's name
 *         password:
 *           type: string
 *           nullable: true
 *           description: Hashed password, null if using OAuth
 *         avatar:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: GridFS file ID of avatar image
 *         authProviders:
 *           type: array
 *           items:
 *             type: string
 *             enum: [email, google, github, discord, wallet]
 *           description: Authentication methods linked to the account
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
 *             $ref: '#/components/schemas/Project'
 *           description: List of user projects (max 3)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *       example:
 *         accountId: 123e4567-e89b-12d3-a456-426614174000
 *         email: user@example.com
 *         name: Joh Doe
 *         avatar: 66a5f1aaf3182e001f7f1234
 *         authProviders: [email, google]
 *         passwordHash: $2b$10$somethinghashed
 *         googleId: "google-oauth-id"
 *         githubId: null
 *         discordId: null
 *         rpcCredits: 100_000
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
 * /auth/check-email:
 *   post:
 *     summary: Checks if email exist and send a response to request for password for authentication
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
import { checkEmail } from "../../controllers/auth-controller/authController.js";
import { validateEmail } from "../../utils/validations.js";

const authRouter = Router();

authRouter.post("/check-email", validateEmail, checkEmail);

authRouter.post("/google", (req, res) => {
	res.json(`Login with google`);
});

export default authRouter;
