import CustomBadRequestError from "../errors/customBadRequestError.js";
import { findUserByProjectId } from "../utils/lib.js";
import axios from "axios";

const ENDPOINTS = {
	testnet: process.env.HORIZON_TESTNET_URL,
	public: process.env.HORIZON_PUBLIC_URL,
};

export async function callHorizonNetwork(req, res) {
	const { network, primaryResource, secondaryResource, tertiaryResource } =
		req.params;

	const { accountId: _id, projectId } = req.query;

	const user = await findUserByProjectId(_id, projectId);

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
		console.error(error);
		next(error);
	}
}
