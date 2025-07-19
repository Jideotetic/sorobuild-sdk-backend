import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true,
	},
	name: {
		type: String,
		trim: true,
		default: null,
	},
	password: {
		type: String,
		default: null,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	verificationToken: {
		type: String,
		default: null,
	},
	avatar: {
		type: mongoose.Schema.Types.ObjectId,
		default: null,
	},
	authProviders: {
		type: [String],
		enum: ["email", "google", "github", "discord", "wallet"],
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
	walletId: {
		type: String,
		default: null,
	},
	rpcCredits: {
		type: Number,
		default: 100_000,
	},
	projectLimit: {
		type: Number,
		default: 3,
	},
	projects: {
		type: [mongoose.Schema.Types.ObjectId],
		ref: "Project",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	const hash = await bcrypt.hash(this.password, 10);
	this.password = hash;
	next();
});

userSchema.methods.isValidPassword = async function (password) {
	const user = this;
	const compare = await bcrypt.compare(password, user.password);

	return compare;
};

export const User = mongoose.model("User", userSchema);
