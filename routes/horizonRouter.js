/**
 * @swagger
 * tags:
 *   name: Horizon
 *   description: Horizon management APIs
 */

/**
 * @swagger
 * /horizon/{network}:
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

const horizonRouter = Router();

const ENDPOINTS = {
	testnet: "https://base-testnet-horizon.soro.build",
	public: "https://base-public-horizon.soro.build",
};

horizonRouter.get("/:network", async (req, res) => {
	const { network } = req.params;
	// const body = req.body;

	if (!["testnet", "public"].includes(network)) {
		return res
			.status(400)
			.json({ error: 'Invalid network. Use "testnet" or "public".' });
	}

	const baseUrl = ENDPOINTS[network];

	try {
		const { data, status } = await axios.get(baseUrl, {
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

export default horizonRouter;
