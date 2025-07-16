import { validationResult } from "express-validator";
import { User } from "../../model/user.js";

export async function getEmail(req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email } = req.body;

	console.log(email);

	try {
		const existingUser = await User.findOne({ email });

		console.log(existingUser);

		res.json(existingUser);
	} catch (error) {
		console.error(error);
		res.status(500).json(error);
	}
}
