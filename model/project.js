import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
	projectId: {
		type: String,
		required: true,
		unique: true,
	},
	name: {
		type: String,
	},
	whitelistedDomain: {
		type: String,
		required: true,
	},
	devMode: {
		type: Boolean,
		default: true,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const Project = mongoose.model("Project", projectSchema);
