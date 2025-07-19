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
 *           description: User's email address
 *         name:
 *           type: string
 *           description: User's name
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
 *       example:
 *         _id: 687a03c9399764f331370f96
 *         email: user@example.com
 *         name: Joh Doe
 *         avatar: 687a03c9399764f331370f96
 *         isVerified: false
 *         authProviders: [email]
 *         googleId: null
 *         githubId: null
 *         discordId: null
 *         walletId: null
 *         rpcCredits: 100_000
 *         projects: [
 *           {
 *             _id: 687a03c9399764f331370f96,
 *             name: Default Project,
 *             whitelistedDomain: https://example.com,
 *             devMode: true,
 *             createdAt: 2025-07-16T12:00:00.000Z
 *            }
 *          ]
 *         createdAt: 2025-07-16T15:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
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
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Creates and authenticate a user
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
 *         description: User verified successfully
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
 *                   example: User verified successfully
 *                 user:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal server error
 */

// /**
//  * @swagger
//  * /auth/google:
//  *   get:
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
	generateToken,
	verifyUser,
} from "../../controllers/auth-controller/authController.js";
import {
	emailPayloadSchema,
	signUpPayloadSchema,
	signInPayloadSchema,
	generateTokenPayloadSchema,
	passwordSchema,
} from "../../utils/validations.js";
import { authenticateAppUser } from "../../middlewares/guards.js";
import { authRateLimiter } from "../../middlewares/rate-limit.js";

const authRouter = Router();

authRouter.post(
	"/generate",
	authRateLimiter,
	generateTokenPayloadSchema,
	generateToken
);

authRouter.post(
	"/email",
	authenticateAppUser,
	emailPayloadSchema,
	validateEmailPayload
);

authRouter.post(
	"/signup",
	authenticateAppUser,
	signUpPayloadSchema,
	validateSignUpPayload,
	passportAuthHandler("signup", 201)
);

authRouter.post(
	"/signin",
	authenticateAppUser,
	signInPayloadSchema,
	validateSignInPayload,
	passportAuthHandler("signin", 200)
);

authRouter.post(
	"/verify",
	passwordSchema,
	verifyUser,
	passportAuthHandler("signin", 200)
);

// authRouter.get(
// 	"/google",
// 	passport.authenticate("google", { scope: ["profile"] })
// );

// authRouter.get(
// 	"/google/callback",
// 	passport.authenticate("google", { failureRedirect: "/login" }),
// 	function (req, res) {
// 		// Successful authentication, redirect home.
// 		res.redirect("/");
// 	}
// );

// authRouter.post("/google", async (req, res, next) => {
// 	try {
// 		const { id_token } = req.body;

// 		if (!id_token) {
// 			return next(new CustomBadRequestError("Missing Google ID token"));
// 		}

// 		const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 		const ticket = await client.verifyIdToken({
// 			idToken: id_token,
// 			audience: process.env.GOOGLE_CLIENT_ID,
// 		});

// 		const payload = ticket.getPayload();
// 		const { sub: googleId, email, name, picture } = payload;

// 		let user = await User.findOne({ googleId });

// 		if (!user) {
// 			// Create new user
// 			user = new User({
// 				googleId,
// 				email,
// 				name,
// 				authProviders: ["google"],
// 				avatar: picture, // optional
// 			});
// 			await user.save();
// 		}

// 		// Issue your own JWT
// 		const token = jwt.sign(
// 			{ user: { _id: user._id, email: user.email } },
// 			process.env.JWT_SECRET,
// 			{ expiresIn: "7d" }
// 		);

// 		const userObj = user.toObject();
// 		delete userObj.password;

// 		res.status(200).json({
// 			statusCode: 200,
// 			message: "Google sign-in successful",
// 			user: { ...userObj, token },
// 		});
// 	} catch (err) {
// 		next(err);
// 	}
// });

export default authRouter;
