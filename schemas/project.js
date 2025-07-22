import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

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
