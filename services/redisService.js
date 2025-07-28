import { createClient } from "redis";

const redisClient = createClient({
	url: "redis://default:fvNriQqWrW2Rz76hxwKW5SjH8HI2ST5c@redis-14180.c309.us-east-2-1.ec2.redns.redis-cloud.com:14180",
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

(async () => {
	await redisClient.connect();
})();

export default redisClient;
