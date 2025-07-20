import redisClient from "../services/redisService.js";

// Store token in Redis with TTL (expires after token expiry time)
export async function blacklistToken(token, expiresInSeconds) {
	await redisClient.set(`blacklist:${token}`, "true", {
		EX: expiresInSeconds,
	});
}

// Check if token is blacklisted
export async function isTokenBlacklisted(token) {
	const result = await redisClient.get(`blacklist:${token}`);
	return result === "true";
}
