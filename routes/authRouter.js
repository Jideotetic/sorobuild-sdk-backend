/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         _id:
 *          type: string
 *          description: Unique account ID
 *         email:
 *           type: string
 *           description: Unique user's email address
 *         name:
 *           type: string
 *           nullable: true
 *           description: User's full name
 *         avatar:
 *           type: string
 *           nullable: true
 *           description: File ID of avatar image
 *         isVerified:
 *           type: boolean
 *           description: Flag for when user complete registration
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
 *           description: Available RPC credits for account
 *         projects:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Project'
 *           description: List of user projects (max 3)
 *         createdAt:
 *           type: string
 *           description: Account creation timestamp
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management APIs
 */

/**
 * @swagger
 * /auth/generate:
 *   post:
 *     summary: Generate access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               api_id:
 *                 type: string
 *                 example: string
 *               api_key:
 *                 type: string
 *                 example: string
 *     responses:
 *       200:
 *         description: Access token generated successfully
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
 *                   example: Access token generated successfully
 *                 token:
 *                   type: string
 *       429:
 *         description: Too many request
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/email:
 *   post:
 *     summary: Checks if email exist and send a response to request password for authentication or onboard new user
 *     tags: [Auth]
 *     security:
 *       - Authorization: []
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
 *                   enum:
 *                     - User exist, Prompt for password
 *                     - User exist, Check the previous email that was sent to complete registration
 *                     - Check your email to complete registration
 *                   example: User exist, Prompt for password.
 *                 userExists:
 *                   type: boolean
 *                   example: true
 *                 nextAction:
 *                   type: string
 *                   enum:
 *                     - COMPLETE_PREVIOUS_EMAIL_VERIFICATION
 *                     - COMPLETE_EMAIL_VERIFICATION
 *                     - REQUEST_PASSWORD
 *                   example: REQUEST_PASSWORD
 *       401:
 *         description: Unauthorized Request
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Verify email to complete registration
 *     tags: [Auth]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: query
 *         name: verificationToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The verification token embedded in the link sent
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                  type: string
 *                  example: string
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
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized Request
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
 *     security:
 *       - Authorization: []
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
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized Request
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/google:
 *    get:
 *      summary: Sign in with Google (requires redirect)
 *      tags: [Auth]
 *      security:
 *       - Authorization: []
 *      description:
 *        This route redirects the user to Google for authentication.
 *        This cannot be tested from Swagger UI use a browser instead.
 *      responses:
 *        302:
 *          description: Redirects to Google OAuth
 */

/**
 * @swagger
 * /auth/signout:
 *   post:
 *     summary: Sign out a user
 *     tags: [Auth]
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: header
 *         name: idToken
 *         schema:
 *           type: string
 *         required: true
 *         description: ID token
 *     responses:
 *       200:
 *         description: User signed out successfully
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
 *                   example: User signed out successfully
 *       401:
 *         description: Unauthorized Request
 *       500:
 *         description: Internal server error
 */

import { Router } from "express";
import {
	validateEmail,
	validateSignIn,
	generateAuthorizationToken,
	verifyUser,
	signout,
} from "../controllers/authController.js";
import {
	emailPayloadValidation,
	signInPayloadValidation,
	generateTokenPayloadValidation,
	passwordPayloadValidation,
} from "../middlewares/validations.js";
import {
	verifyAuthorizationToken,
	verifyIdToken,
} from "../middlewares/guards.js";
import {
	handleGoogleAuthCallback,
	passportAuthHandler,
} from "../middlewares/authenticate.js";
import passport from "passport";

const authRouter = Router();

authRouter.post(
	"/generate",
	generateTokenPayloadValidation,
	generateAuthorizationToken
);

authRouter.post(
	"/email",
	verifyAuthorizationToken,
	emailPayloadValidation,
	validateEmail
);

authRouter.post(
	"/verify",
	verifyAuthorizationToken,
	passwordPayloadValidation,
	verifyUser,
	passportAuthHandler("signin", 200)
);

authRouter.post(
	"/signin",
	verifyAuthorizationToken,
	signInPayloadValidation,
	validateSignIn,
	passportAuthHandler("signin", 200)
);

authRouter.get(
	"/google",
	verifyAuthorizationToken,
	passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get("/google/callback", async (req, res, next) => {
	passport.authenticate("google", (err, user, info) => {
		handleGoogleAuthCallback(req, res, next, err, user, info);
	})(req, res, next);
});

authRouter.post("/signout", verifyAuthorizationToken, verifyIdToken, signout);

export default authRouter;
