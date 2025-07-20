import CustomBadRequestError from "../errors/customBadRequestError.js";
import crypto from "crypto";

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
