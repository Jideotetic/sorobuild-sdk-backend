import CustomBadRequestError from "../errors/customBadRequestError.js";
import { findUserByProjectId } from "../utils/lib.js";
import axios from "axios";

const ENDPOINTS = {
	testnet: process.env.RPC_TESTNET_URL,
	public: process.env.RPC_PUBLIC_URL,
};

export async function callRPCNetwork(req, res) {
	const { network } = req.params;
	const { accountId: _id, projectId } = req.query;
	const body = req.body;

	const user = await findUserByProjectId(_id, projectId);

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

		console.log({ status, data, baseUrl });

		res.status(status).json(data);
	} catch (error) {
		console.error(error);
		next(error);
	}
}
