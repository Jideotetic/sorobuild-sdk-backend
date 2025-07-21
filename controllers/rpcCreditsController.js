import mongoose from "mongoose";
import CustomBadRequestError from "../errors/customBadRequestError.js";
import CustomNotFoundError from "../errors/customNotFoundError.js";
import { User } from "../schemas/user.js";
import { verifyRequestBody } from "../middlewares/guards.js";
import { findUser } from "../utils/lib.js";

export async function getAccountRpcCredits(req, res, next) {
	try {
		const { accountId: _id } = req.params;

		const user = await findUser(_id);

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
