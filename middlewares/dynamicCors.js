import CustomBadRequestError from "../errors/customBadRequestError.js";
import CustomForbiddenError from "../errors/customForbiddenError.js";

export async function dynamicCORS(req, res, next) {
	try {
		const origin = req.headers.origin;
		const user = req.user;
		const project = req.project;

		// Check for project key if call is from a sever side application
		if (!origin) {
			const apiSecret = req.headers["x-api-secret"];
			if (!apiSecret) {
				throw new CustomBadRequestError("API secret is missing");
			}
			req.user = user;
			return next();
		}

		if (
			project.devMode &&
			/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
		) {
			res.setHeader("Access-Control-Allow-Origin", origin);
			res.setHeader("Access-Control-Allow-Headers", "Content-Type");
			res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

			if (req.method === "OPTIONS") {
				return res.sendStatus(200);
			}
			console.log({ origin });
			req.user = user;
			return next();
		}

		// Check for whitelistedDomain if it is client and allow cors
		if (project.whitelistedDomain && project.whitelistedDomain === origin) {
			res.setHeader("Access-Control-Allow-Origin", origin);
			res.setHeader("Access-Control-Allow-Headers", "Content-Type");
			res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

			if (req.method === "OPTIONS") {
				return res.sendStatus(200);
			}

			req.user = user;
			return next();
		} else {
			throw new CustomForbiddenError(
				"Forbidden domain...update your project whitelisted domain"
			);
		}
	} catch (error) {
		next(error);
	}
}
