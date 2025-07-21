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
	testnet: process.env.HORIZON_TESTNET_URL,
	public: process.env.HORIZON_PUBLIC_URL,
};

horizonRouter.get(
	"/:network{/:primaryResource}{/:secondaryResource}{/:tertiaryResource}",
	async (req, res) => {
		const { network, primaryResource, secondaryResource, tertiaryResource } =
			req.params;

		const baseUrl = ENDPOINTS[network];

		if (!baseUrl) {
			return res
				.status(400)
				.json({ error: 'Invalid network. Use "testnet" or "public".' });
		}

		const isPlaceholder = (val) =>
			typeof val === "string" && val.startsWith("{") && val.endsWith("}");

		let targetUrl = baseUrl;

		if (primaryResource && !isPlaceholder(primaryResource)) {
			targetUrl += `/${primaryResource}`;
		}

		if (secondaryResource && !isPlaceholder(secondaryResource)) {
			targetUrl += `/${secondaryResource}`;
		}

		if (tertiaryResource && !isPlaceholder(tertiaryResource)) {
			targetUrl += `/${tertiaryResource}`;
		}

		console.log("→ Final Target URL:", targetUrl);

		try {
			const response = await axios.get(targetUrl, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			res.status(response.status).json(response.data);
		} catch (error) {
			const status = error.response?.status || 500;
			const message = error.response?.data || { error: "Proxy request failed" };
			res.status(status).json(message);
		}
	}
);

export default horizonRouter;
