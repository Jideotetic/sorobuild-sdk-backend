import passport from "passport";
import { promisify } from "util";
import CustomNotFoundError from "../errors/customNotFoundError.js";
import CustomBadRequestError from "../errors/customBadRequestError.js";
import jwt from "jsonwebtoken";
import { buildRedirectUrl } from "../utils/lib.js";
import { Buffer } from "buffer";

export async function handleAuthCallback(
	req,
	res,
	next,
	err,
	user,
	info,
	statusCode
) {
	if (err || !user) {
		console.error("Auth failed:", { err, info });
		const message = info.message || "Authentication failed";
		if (message === "No user found ...Kindly sign up") {
			return next(new CustomNotFoundError(message));
		} else {
			return next(new CustomBadRequestError(message));
		}
	}

	try {
		await promisify(req.login).bind(req)(user, { session: false });

		const JWT_SECRET = process.env.JWT_SECRET;

		const body = { ...user };
		const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
			expiresIn: "24h",
		});

		const userObj = user.toObject();
		delete userObj.password;

		return res.status(statusCode).json({
			statusCode,
			message: info?.message || "Success",
			user: { ...userObj, token },
		});
	} catch (error) {
		return next(error);
	}
}

export function passportAuthHandler(strategyName, statusCode) {
	return (req, res, next) => {
		console.log("🚨  Callback route hit!", req.url);
		passport.authenticate(strategyName, (err, user, info) => {
			handleAuthCallback(req, res, next, err, user, info, statusCode);
		})(req, res, next);
	};
}

export async function handleGoogleAuthCallback(
	req,
	res,
	next,
	err,
	user,
	info
) {
	const redirectBaseUrl = process.env.FRONTEND_GOOGLE_CALLBACK_URL;

	if (err || !user) {
		console.error("Google Auth Error:", { err, info });

		const message = info?.message || "Google authentication failed";

		const redirectUrl = buildRedirectUrl({
			baseUrl: redirectBaseUrl,
			error: message,
		});

		return res.redirect(redirectUrl);
	}

	try {
		await promisify(req.login).bind(req)(user, { session: false });

		const JWT_SECRET = process.env.JWT_SECRET;
		const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
			expiresIn: "24h",
		});

		let userObj = user.toObject();
		delete userObj.password;

		userObj = { ...userObj, token };

		const userJson = JSON.stringify(userObj);
		const userBase64 = Buffer.from(userJson).toString("base64");

		console.log({ token, userBase64 });
		const redirectUrl = buildRedirectUrl({
			baseUrl: redirectBaseUrl,
			userBase64,
		});

		return res.redirect(redirectUrl);
	} catch (error) {
		console.error("Login Session Error:", error);

		const redirectUrl = buildRedirectUrl({
			baseUrl: redirectBaseUrl,
			error: "Internal server error during login",
		});

		return res.redirect(redirectUrl);
	}
}
