import CustomBadRequestError from "../errors/customBadRequestError.js";
import crypto from "crypto";
import { User } from "../schemas/user.js";
import CustomNotFoundError from "../errors/customNotFoundError.js";

export const extractIdToken = (req) => {
	const header =
		req.headers["idtoken"] || req.headers["idToken"] || req.headers["IdToken"];
	if (!header) return null;

	if (!header.startsWith("Bearer ")) {
		throw new CustomBadRequestError(
			"Invalid idToken syntax...start token with Bearer"
		);
	}

	return header.split(" ")[1];
};

export const generateVerificationToken = (email) => {
	const hash = crypto.createHash("sha256");
	hash.update(email + crypto.randomBytes(32).toString("hex"));
	const verificationToken = hash.digest("hex");
	return verificationToken;
};

export async function findUser(_id) {
	if (!_id) {
		throw new CustomBadRequestError("Account ID missing");
	}

	if (!mongoose.Types.ObjectId.isValid(_id)) {
		throw new CustomBadRequestError("Invalid accountId");
	}

	const user = await User.findOne({ _id });

	if (!user) {
		throw new CustomNotFoundError(
			"User not found with the provided account ID"
		);
	}

	return user;
}
