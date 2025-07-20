import passport from "passport";
import CustomUnauthorizedError from "../errors/customUnauthorizedError.js";
import { validationResult } from "express-validator";
import CustomBadRequestError from "../errors/customBadRequestError.js";
import { isTrustedClient } from "./clients.js";
import { isTokenBlacklisted } from "./blackListToken.js";
import { extractIdToken } from "../utils/lib.js";

export const verifyAuthorizationToken = (req, res, next) => {
	if (isTrustedClient(req)) {
		return next();
	}

	passport.authenticate("app-jwt", { session: false }, (err, type, info) => {
		if (err || !type) {
			const message = info?.message;
			if (message === "No auth token") {
				return next(
					new CustomUnauthorizedError("No Authorization token present")
				);
			} else if (
				message === "invalid signature" ||
				message === "jwt malformed"
			) {
				return next(new CustomUnauthorizedError("Invalid Authorization token"));
			} else {
				return next(new CustomUnauthorizedError(message));
			}
		}
		req.type = type;
		next();
	})(req, res, next);
};

export const verifyIdToken = (req, res, next) => {
	passport.authenticate(
		"id-jwt",
		{ session: false },
		async (err, user, info) => {
			if (err || !user) {
				const message = info?.message;
				if (message === "No auth token") {
					return next(new CustomUnauthorizedError("No idToken token present"));
				} else if (
					message === "invalid signature" ||
					message === "jwt malformed"
				) {
					return next(new CustomUnauthorizedError("Invalid idToken"));
				} else {
					return next(new CustomUnauthorizedError(message));
				}
			}

			const token = extractIdToken(req);

			const blacklisted = await isTokenBlacklisted(token);
			if (blacklisted) {
				return next(new CustomUnauthorizedError("Invalid idToken"));
			}

			req.user = user;
			req.token = token;
			next();
		}
	)(req, res, next);
};

export const verifyRequestBody = (req) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		throw new CustomBadRequestError(JSON.stringify(errors.array()));
	}
};
