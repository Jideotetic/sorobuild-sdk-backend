/**
 * @swagger
 * tags:
 *   name: RPC Horizons
 *   description: RPC Horizons management APIs
 */

/**
 * @swagger
 * /rpc-horizon/{api}/{network}:
 *   post:
 *     summary: Make a request to rpc or horizon
 *     tags: [RPC Horizons]
 *     parameters:
 *       - in: path
 *         name: api
 *         required: true
 *         schema:
 *           type: string
 *         description: The api to call rpc or horizon
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

const rpcHorizonRouter = Router();

const ENDPOINTS = {
	rpc: {
		testnet: "https://base-testnet-rpc.soro.build",
		public: "https://base-public-rpc.soro.build",
	},
	horizon: {
		testnet: "https://base-testnet-horizon.soro.build",
		public: "https://base-public-horizon.soro.build",
	},
};

rpcHorizonRouter.post("/:api/:network", async (req, res) => {
	const { api, network } = req.params;
	const body = req.body;

	if (!["rpc", "horizon"].includes(api)) {
		return res
			.status(400)
			.json({ error: 'Invalid API type. Use "rpc" or "horizon".' });
	}

	if (!["testnet", "public"].includes(network)) {
		return res
			.status(400)
			.json({ error: 'Invalid network. Use "testnet" or "public".' });
	}

	const baseUrl = ENDPOINTS[api][network];

	try {
		if (api === "rpc") {
			const { data, status } = await axios.post(baseUrl, body, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			console.log({ status, data });

			res.status(status).json(data);
		} else if (api === "horizon") {
			const { data, status } = await axios.get(baseUrl, body, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			console.log({ status, data });

			res.status(status).json(data);
		}
	} catch (error) {
		console.error(error.response?.data || error.message);
		res.status(error.response?.status || 500).json({
			error: error.response?.data || "Error forwarding request.",
		});
	}
});

export default rpcHorizonRouter;
