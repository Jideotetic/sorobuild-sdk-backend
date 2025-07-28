import rateLimit from "express-rate-limit";
import { RateLimiterMemory } from "rate-limiter-flexible";
import CustomBadRequestError from "../errors/customBadRequestError.js";
import { decryptProjectId, findUserByProjectId } from "../utils/lib.js";
import CustomTooManyRequestError from "../errors/customTooManyRequestError.js";

export const PLAN_RATE_LIMITS = {
	free: { points: 1500, duration: 60 },
	pro: { points: 2000, duration: 60 },
};

export const generalRateLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 5,
	message: {
		statusCode: 429,
		message: "Too many requests, please try again later.",
		name: "TooManyRequestError",
	},
	standardHeaders: true,
	legacyHeaders: false,
});

const limiterCache = new Map();

export async function rateLimitByProjectId(req, res, next) {
	try {
		const { projectId } = req.query;

		console.log({ projectId });

		if (!projectId) {
			throw new CustomBadRequestError("Project ID missing");
		}

		const decrypted = decryptProjectId(projectId);
		const [accountId, randomizedId, projectIdToken] = decrypted.split("_");

		const { user, project } = await findUserByProjectId(
			accountId,
			projectIdToken,
			randomizedId
		);

		// Determine user's plan (fallback to 'default' if not set)
		const userPlan = user.plan;
		const limits = PLAN_RATE_LIMITS[userPlan];

		const cacheKey = `${userPlan}-${limits.points}-${limits.duration}`;

		if (!limiterCache.has(cacheKey)) {
			const limiter = new RateLimiterMemory({
				points: limits.points,
				duration: limits.duration,
				keyPrefix: `rl-${userPlan}`,
			});
			limiterCache.set(cacheKey, limiter);
		}

		const rateLimiter = limiterCache.get(cacheKey);

		// Use projectId as rate limit key
		rateLimiter
			.consume(projectId)
			.then((rateInfo) => {
				console.log(
					`[RATE LIMIT ALLOWED] Project: ${projectId}, Plan: ${userPlan}`
				);
				req.user = user;
				req.project = project;
				next();
			})
			.catch((rateInfo) => {
				console.warn(
					`[RATE LIMIT BLOCKED] Project: ${projectId}, Plan: ${userPlan}`
				);

				next(
					new CustomTooManyRequestError("Rate limit exceeded. Try again later.")
				);
			});
	} catch (error) {
		next(error);
	}
}
