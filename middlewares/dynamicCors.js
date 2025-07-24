import CustomBadRequestError from "../errors/customBadRequestError.js";
import CustomForbiddenError from "../errors/customForbiddenError.js";
import { decryptProjectId, findUserByProjectId } from "../utils/lib.js";

export async function dynamicCORS(req, res, next) {
	try {
		const origin = req.headers.origin;
		const { projectId } = req.query;

		if (!projectId) {
			throw new CustomBadRequestError("Project ID missing");
		}

		const decrypted = decryptProjectId(projectId);
		const [accountId, randomId, projectIdToken] = decrypted.split("_");

		const { user, project } = await findUserByProjectId(
			accountId,
			projectIdToken,
			randomId
		);

		// Check for project key if call is from a sever side application
		if (!origin) {
			const apiSecret = req.headers["x-api-secret"];
			if (!apiSecret) {
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
			throw new CustomForbiddenError(
				"Forbidden domain...update your project whitelisted domain"
			);
		}
	} catch (error) {
		next(error);
	}
}
