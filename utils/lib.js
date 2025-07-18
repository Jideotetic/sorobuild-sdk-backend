import CustomBadRequestError from "../errors/customBadRequestError.js";

export const extractIdToken = (req) => {
	const header =
		req.headers["idtoken"] || req.headers["idToken"] || req.headers["IdToken"];
	if (!header) return null;

	if (!header.startsWith("Bearer ")) {
		throw new CustomBadRequestError(JSON.stringify("Invalid token syntax"));
	}

	return header.split(" ")[1];
};
