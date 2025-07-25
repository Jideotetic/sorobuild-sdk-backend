import CustomBadRequestError from "../errors/customBadRequestError.js";
import CustomForbiddenError from "../errors/customForbiddenError.js";
import axios from "axios";

const ENDPOINTS = {
	testnet: process.env.HORIZON_TESTNET_URL,
	public: process.env.HORIZON_PUBLIC_URL,
};

export async function callHorizonNetwork(req, res) {
	const { network, primaryResource, secondaryResource, tertiaryResource } =
		req.params;
	const user = req.user;

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

	if (user.rpcCredits < 2) {
		throw new CustomForbiddenError("Not enough RPC credits");
	}

	try {
		const { data, status } = await axios.get(targetUrl, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		user.rpcCredits -= 2;
		await user.save();

		res.status(status).json({
			statusCode: status,
			data,
		});
	} catch (error) {
		console.error(error.response?.data || error.message);
		res.status(error.response?.status || 500).json({
			error: error.response?.data || "Error forwarding request.",
		});
	}
}
