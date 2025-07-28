/**
 * @swagger
 * tags:
 *   name: Horizon
 *   description: Horizon management APIs
 */

/**
 * @swagger
 * /horizon/{network}/open/{primaryResource}/{secondaryResource}/{tertiaryResource}:
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
import CustomBadRequestError from "../errors/customBadRequestError.js";
import axios from "axios";
import { dynamicCORS } from "../middlewares/dynamicCors.js";
import { rateLimitByProjectId } from "../middlewares/rateLimit.js";

const horizonRouter = Router();

const ENDPOINTS = {
	testnet: process.env.HORIZON_TESTNET_URL,
	public: process.env.HORIZON_PUBLIC_URL,
};

horizonRouter.get(
	"/:network/open{/:primaryResource}{/:secondaryResource}{/:tertiaryResource}",
	async (req, res) => {
		const { network, primaryResource, secondaryResource, tertiaryResource } =
			req.params;

		if (!["testnet", "public"].includes(network)) {
			throw new CustomBadRequestError(
				'Invalid network. Use "testnet" or "public".'
			);
		}

		const baseUrl = ENDPOINTS[network];

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

		try {
			const { data, status } = await axios.get(targetUrl, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			res.status(status).json(data);
		} catch (error) {
			return next(error);
		}
	}
);

horizonRouter.get(
	"/:network{/:primaryResource}{/:secondaryResource}{/:tertiaryResource}",
	rateLimitByProjectId,
	dynamicCORS,
	callHorizonNetwork
);

export default horizonRouter;
