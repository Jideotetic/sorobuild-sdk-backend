import CustomBadRequestError from "../errors/customBadRequestError.js";
import CustomForbiddenError from "../errors/customForbiddenError.js";
import axios from "axios";

const ENDPOINTS = {
	testnet: process.env.RPC_TESTNET_URL,
	public: process.env.RPC_PUBLIC_URL,
};

export async function callRPCNetwork(req, res, next) {
	const { network } = req.params;
	const body = req.body;
	const user = req.user;

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

		user.rpcCredits -= 2;
		await user.save();

		res.status(status).json(data);
	} catch (error) {
		console.log(error.response.data || error.message);
		res.status(error.response?.status).json(error.response.data);
	}
}
