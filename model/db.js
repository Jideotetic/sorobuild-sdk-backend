import "dotenv/config";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

export let bucket;

export async function connectToMongoDB() {
	try {
		if (!process.env.DB_URI) {
			throw new Error(
				"❌ Missing database connection in environment variables"
			);
		}

		await mongoose.connect(process.env.DB_URI);

		if (!bucket) {
			bucket = new GridFSBucket(mongoose.connection.db, {
				bucketName: "avatars",
			});
		}

		console.log("✅ Connected to MongoDB");
	} catch (error) {
		console.error("❌ MongoDB connection error:", error);
		process.exit(1);
	}
}
