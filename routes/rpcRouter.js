/**
 * @swagger
 * tags:
 *   name: RPC
 *   description: RPC management APIs
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

import axios from "axios";
import { Router } from "express";

const rpcRouter = Router();

const ENDPOINTS = {
	testnet: process.env.RPC_TESTNET_URL,
	public: process.env.RPC_PUBLIC_URL,
};

rpcRouter.post("/:network", async (req, res) => {
	const { network } = req.params;
	const body = req.body;

	if (!["testnet", "public"].includes(network)) {
		return res
			.status(400)
			.json({ error: 'Invalid network. Use "testnet" or "public".' });
	}

	const baseUrl = ENDPOINTS[network];

	try {
		const { data, status } = await axios.post(baseUrl, body, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		console.log({ status, data, baseUrl });

		res.status(status).json(data);
	} catch (error) {
		console.error(error.response?.data || error.message);
		res.status(error.response?.status || 500).json({
			error: error.response?.data || "Error forwarding request.",
		});
	}
});

export default rpcRouter;
