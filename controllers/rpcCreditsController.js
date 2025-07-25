import { verifyRequestBody } from "../middlewares/guards.js";
import { findUser } from "../utils/lib.js";

export async function getAccountRpcCredits(req, res, next) {
	try {
		const incomingUser = req.user;

		const user = await findUser(incomingUser.id);

		res.status(200).json({
			statusCode: 200,
			message: "RPC credits fetched successfully",
			rpcCredits: user.rpcCredits,
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
}

export async function buyRpcCredits(req, res, next) {
	try {
		verifyRequestBody(req);

		const { accountId: _id } = req.params;

		const user = await findUser(_id);

		res.status(200).json({
			statusCode: 200,
			message: "COMING SOON!",
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
}
