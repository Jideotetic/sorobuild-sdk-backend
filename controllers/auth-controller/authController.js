import { validationResult } from "express-validator";
import { User } from "../../model/user.js";
import CustomBadRequestError from "../../errors/customBadRequestError.js";

export async function checkEmail(req, res) {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new CustomBadRequestError(JSON.stringify(errors.array()));
	}

	const { email } = req.body;

	try {
		const existingUser = await User.findOne({ email });

		console.log(existingUser);

		res.json(existingUser);
	} catch (error) {
		console.error(error);
		res.status(500).json(error);
	}
}
