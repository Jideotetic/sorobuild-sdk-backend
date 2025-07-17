import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const projectSchema = new mongoose.Schema({
	projectId: {
		type: String,
		required: true,
		unique: true,
		default: () => uuidv4(),
	},
	name: {
		type: String,
		default: "Default Project",
	},
	whitelistedDomain: {
		type: String,
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
