import passport from "passport";
import { promisify } from "util";
import CustomNotFoundError from "../errors/customNotFoundError.js";
import CustomBadRequestError from "../errors/customBadRequestError.js";

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
		const token = jwt.sign({ user: body }, JWT_SECRET, {
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
		passport.authenticate(strategyName, (err, user, info) => {
			handleAuthCallback(req, res, next, err, user, info, statusCode);
		})(req, res, next);
	};
}
