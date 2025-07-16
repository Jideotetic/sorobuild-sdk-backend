import "dotenv/config";
import mongoose from "mongoose";

export async function connectToMongoDB() {
	try {
		if (!process.env.DB_URI) {
			throw new Error(
				"❌ Missing database connection in environment variables"
			);
		}

		await mongoose.connect(process.env.DB_URI);
		console.log("✅ Connected to MongoDB");
	} catch (err) {
		console.error("❌ MongoDB connection error:", err);
		process.exit(1);
	}
}
