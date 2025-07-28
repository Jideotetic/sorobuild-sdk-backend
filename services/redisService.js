import { createClient } from "redis";

const redisClient = createClient({
	url: process.env.REDIS_CONNECTION_STRING,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
	await redisClient.connect();
})();

export default redisClient;
