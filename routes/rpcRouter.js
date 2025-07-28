/**
 * @swagger
 * tags:
 *   name: RPC
 *   description: RPC management APIs
 */

/**
 * @swagger
 * /rpc/{network}/open:
 *   post:
 *     summary: Make a request to rpc
 *     tags: [RPC]
 *     parameters:
 *       - in: path
 *         name: network
 *         required: true
 *         schema:
 *           type: string
 *         description: The network to call testnet or public
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /rpc/{network}:
 *   post:
 *     summary: Make a request to rpc
 *     tags: [RPC]
 *     parameters:
 *       - in: path
 *         name: network
 *         required: true
 *         schema:
 *           type: string
 *         description: The network to call testnet or public
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

import { Router } from "express";
import { callRPCNetwork } from "../controllers/rpcController.js";
import CustomBadRequestError from "../errors/customBadRequestError.js";
import axios from "axios";
import { dynamicCORS } from "../middlewares/dynamicCors.js";
import { rateLimitByProjectId } from "../middlewares/rateLimit.js";

const rpcRouter = Router();

const ENDPOINTS = {
	testnet: process.env.RPC_TESTNET_URL,
	public: process.env.RPC_PUBLIC_URL,
};

rpcRouter.post("/:network/open", async (req, res) => {
	const { network } = req.params;
	const body = req.body;

	if (!["testnet", "public"].includes(network)) {
		throw new CustomBadRequestError(
			'Invalid network. Use "testnet" or "public".'
		);
	}

	const baseUrl = ENDPOINTS[network];

	try {
		const { data, status } = await axios.post(baseUrl, body, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		res.status(status).json(data);
	} catch (error) {
		return next(error);
	}
});

rpcRouter.post("/:network", rateLimitByProjectId, dynamicCORS, callRPCNetwork);

export default rpcRouter;
