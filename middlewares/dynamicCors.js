import CustomBadRequestError from "../errors/customBadRequestError.js";
import { findUserByProjectId } from "../utils/lib.js";

export async function dynamicCORS(req, res, next) {
	try {
		const origin = req.headers.origin;
		const { accountId: _id, projectId } = req.query;

		console.log({ origin, _id, projectId });

		const { user, project } = await findUserByProjectId(_id, projectId);

		// Check for project key if call is from a sever side application
		if (!origin) {
			const apiSecret = req.headers["x-api-secret"];
			if (!projectKey) {
				throw new CustomBadRequestError("API secret is missing");
			}
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
			return res.status(403).json({
				statusCode: 403,
				message: "Forbidden domain...update your project whitelisted domain",
			});
		}
	} catch (error) {
		console.error("CORS error:", error);
		return res.status(500).json({ error: error.message });
	}
}
