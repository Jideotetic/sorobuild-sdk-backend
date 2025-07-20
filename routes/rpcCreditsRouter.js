/**
 * @swagger
 * tags:
 *   name: RPC Credits
 *   description: RPC Credits management APIs
 */

/**
 * @swagger
 * /rpc-credits/{accountId}:
 *   get:
 *     summary: Get current rpc credits for an account
 *     tags: [RPC Credits]
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
 *     responses:
 *       200:
 *         description: RPC credits fetched successfully
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
 *                   example: RPC credits fetched successfully
 *                 rpcCredits:
 *                   type: integer
 *                   example: 100_000
 *       401:
 *         description: Unauthorized request
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /rpc-credits/{accountId}:
 *   put:
 *     summary: Buy rpc credits! COMING SOON
 *     tags: [RPC Credits]
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
 *               rpcCredits:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Purchase successful
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
 *                   example:  Purchase successful
 *       401:
 *         description: Unauthorized request
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
import { Router } from "express";
import {
	getAccountRpcCredits,
	buyRpcCredits,
} from "../controllers/rpcCreditsController.js";
import { rpcCreditsPayloadSchema } from "../utils/validations.js";

const rpcCreditsRouter = Router();

rpcCreditsRouter.get("/:accountId", getAccountRpcCredits);

rpcCreditsRouter.put("/:accountId", rpcCreditsPayloadSchema, buyRpcCredits);

export default rpcCreditsRouter;
