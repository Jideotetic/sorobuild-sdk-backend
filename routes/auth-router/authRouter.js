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
 *           description: Unique account ID
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
 *           description: GridFS file link of avatar image
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
 *         walletId:
 *           type: string
 *           nullable: true
 *         rpcCredits:
 *           type: number
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
 *         avatar: "https://api/userId/avatar"
 *         authProviders: [email]
 *         googleId: null
 *         githubId: null
 *         discordId: null
 *         walletId: null
 *         rpcCredits: 100_000
 *         projects: [
 *           {
 *             projectId: 123e4567-e89b-12d3-a456-426614174000,
 *             name: Default Project,
 *             whitelistedDomain: example.com,
 *             devMode: true,
 *             createdAt: 2025-07-16T12:00:00.000Z
 *            }
 *          ]
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
 *       properties:
 *         projectId:
 *           type: string
 *           description: Unique ID for the project
 *         name:
 *           type: string
 *           description: Name of the project
 *         whitelistedDomain:
 *           type: string
 *           format: hostname
 *           description: Domain allowed to use this project
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
 * /auth/email:
 *   post:
 *     summary: Checks if email exist and send a response to request password for authentication or onboard new user
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
 *                 example: string
 *     responses:
 *       200:
 *         description: A successful response
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
 *                   example: User exist, Prompt for password.
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 userExists:
 *                   type: boolean
 *                   example: true
 *                 nextAction:
 *                   type: string
 *                   enum:
 *                     - ONBOARD_NEW_USER
 *                     - REQUEST_PASSWORD
 *                   example: REQUEST_PASSWORD
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Authenticate a user
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
 *                 example: string
 *               password:
 *                 type: string
 *                 example: string
 *     responses:
 *       200:
 *         description: User authenticated successfully
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
 *                   example: User authenticated successfully
 *                 user:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Creates and authenticate a user
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
 *                 example: string
 *               name:
 *                 type: string
 *                 example: string
 *               password:
 *                  type: string
 *                  example: string
 *     responses:
 *       201:
 *         description: User created successfully
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
 *                   example: User created successfully
 *                 user:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */

// /**
//  * @swagger
//  * /auth/google:
//  *   post:
//  *     summary: Login with Google
//  *     tags: [Auth]
//  *     responses:
//  *       200:
//  *         description: Google login response
//  */

import { Router } from "express";
import {
	validateEmailPayload,
	validateSignUpPayload,
	validateSignInPayload,
	passportAuthHandler,
} from "../../controllers/auth-controller/authController.js";
import {
	emailPayloadSchema,
	signUpPayloadSchema,
	signInPayloadSchema,
} from "../../utils/validations.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const authRouter = Router();

authRouter.post("/email", emailPayloadSchema, validateEmailPayload);

authRouter.post(
	"/signup",
	signUpPayloadSchema,
	validateSignUpPayload,
	passportAuthHandler("signup", 201)
);

authRouter.post(
	"/signin",
	signInPayloadSchema,
	validateSignInPayload,
	passportAuthHandler("signin", 200)
);

export default authRouter;
