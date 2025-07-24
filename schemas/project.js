import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
	name: {
		type: String,
		default: "Default Project",
	},
	whitelistedDomain: {
		type: String,
		default: null,
	},
	devMode: {
		type: Boolean,
		default: true,
	},
	projectId: {
		type: String,
		default: null,
	},
	randomId: {
		type: String,
		default: null,
	},
	apiSecret: {
		type: String,
		default: null,
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
