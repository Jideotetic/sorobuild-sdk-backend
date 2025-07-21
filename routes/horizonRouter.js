/**
 * @swagger
 * tags:
 *   name: Horizon
 *   description: Horizon management APIs
 */

/**
 * @swagger
 * /horizon/{network}/{primaryResource}/{secondaryResource}/{tertiaryResource}:
 *   get:
 *     summary: Make a request to horizon
 *     tags: [Horizon]
 *     parameters:
 *       - in: path
 *         name: network
 *         required: true
 *         schema:
 *           type: string
 *         description: The network to call testnet or public
 *       - in: path
 *         name: primaryResource
 *         required: false
 *         schema:
 *           type: string
 *         description:
 *       - in: path
 *         name: secondaryResource
 *         required: false
 *         schema:
 *           type: string
 *         description:
 *       - in: path
 *         name: tertiaryResource
 *         required: false
 *         schema:
 *           type: string
 *         description:
 *       - in: query
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

import { Router } from "express";
import { callHorizonNetwork } from "../controllers/horizonController.js";

const horizonRouter = Router();

horizonRouter.get(
	"/:network{/:primaryResource}{/:secondaryResource}{/:tertiaryResource}",
	callHorizonNetwork
);

export default horizonRouter;
