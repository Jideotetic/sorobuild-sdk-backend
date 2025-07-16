import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	accountId: {
		type: String,
		required: true,
		unique: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	name: {
		type: String,
		required: true,
	},
	authProviders: {
		type: [String],
		enum: ["email", "google", "github", "discord"],
	},
	passwordHash: {
		type: String,
		default: null,
	},
	googleId: {
		type: String,
		default: null,
	},
	githubId: {
		type: String,
		default: null,
	},
	discordId: {
		type: String,
		default: null,
	},
	rpcCredits: {
		type: Number,
		default: 100000,
	},
	projects: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Project",
			validate: [(arr) => arr.length <= 3, "{PATH} limit exceeded"],
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const User = mongoose.model("User", userSchema);
