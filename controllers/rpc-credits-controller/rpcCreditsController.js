import mongoose from "mongoose";
import CustomBadRequestError from "../../errors/customBadRequestError.js";
import CustomNotFoundError from "../../errors/customNotFoundError.js";
import { User } from "../../schemas/user.js";
import { validationResult } from "express-validator";

export async function getAccountRpcCredits(req, res, next) {
	try {
		const { accountId: _id } = req.params;

		if (!_id) {
			throw new CustomBadRequestError(JSON.stringify("Account ID missing"));
		}

		if (!mongoose.Types.ObjectId.isValid(_id)) {
			throw new CustomBadRequestError(JSON.stringify("Invalid accountId"));
		}

		const user = await User.findOne({ _id });

		if (!user) {
			throw new CustomNotFoundError(
				JSON.stringify("User not found with the provided account ID")
			);
		}

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
	const errors = validationResult(req);
	try {
		if (!errors.isEmpty()) {
			throw new CustomBadRequestError(JSON.stringify(errors.array()));
		}

		const { accountId: _id } = req.params;

		if (!_id) {
			throw new CustomBadRequestError(JSON.stringify("Account ID missing"));
		}

		if (!mongoose.Types.ObjectId.isValid(_id)) {
			throw new CustomBadRequestError(JSON.stringify("Invalid accountId"));
		}

		const user = await User.findOne({ _id });

		if (!user) {
			throw new CustomNotFoundError(
				JSON.stringify("User not found with the provided account ID")
			);
		}

		res.status(200).json({
			statusCode: 200,
			message: "COMING SOON!",
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
}
