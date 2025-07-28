import CustomBadRequestError from "../errors/customBadRequestError.js";
import crypto from "crypto";
import { User } from "../schemas/user.js";
import CustomNotFoundError from "../errors/customNotFoundError.js";
import jwt from "jsonwebtoken";
import CustomUnauthorizedError from "../errors/customUnauthorizedError.js";
import CustomForbiddenError from "../errors/customForbiddenError.js";

export const extractIdToken = (req) => {
	const header =
		req.headers["idtoken"] || req.headers["idToken"] || req.headers["IdToken"];
	if (!header) return null;

	if (!header.startsWith("Bearer ")) {
		throw new CustomBadRequestError(
			"Invalid idToken syntax...start token with Bearer"
		);
	}

	return header.split(" ")[1];
};

export const generateVerificationToken = (email) => {
	const hash = crypto.createHash("sha256");
	hash.update(email + crypto.randomBytes(32).toString("hex"));
	const verificationToken = hash.digest("hex");
	return verificationToken;
};

export async function findUser(id) {
	const user = await User.findOne({ _id: id });

	if (!user) {
		throw new CustomForbiddenError("Invalid token");
	}

	return user;
}

export async function findUserByProjectId(accountId, projectId, randomizedId) {
	const user = await User.findOne({ _id: accountId }).populate("projects");

	if (!user) {
		throw new CustomNotFoundError(
			"User not found with the provided project ID"
		);
	}

	const project = user.projects.find(
		(p) => p._id.toString() === projectId.toString()
	);

	console.log(project.randomId, randomizedId);

	if (!project) {
		throw new CustomForbiddenError(
			"This project does not belong to this account"
		);
	}

	if (project.randomId !== randomizedId) {
		throw new CustomForbiddenError("Project ID is no longer valid");
	}

	return { user, project };
}

export async function findUserProjects(id) {
	const user = await User.findOne({ _id: id }).populate("projects");

	if (!user) {
		throw new CustomNotFoundError(
			"User not found with the provided account ID"
		);
	}

	return user;
}

export function buildRedirectUrl({ baseUrl, error, userBase64 }) {
	const url = new URL(baseUrl);

	if (userBase64) {
		url.searchParams.set("success", encodeURIComponent(userBase64));
	} else if (error) {
		url.searchParams.set("error", encodeURIComponent(error));
	}

	return url.toString();
}

export async function getAccountIdFromIdToken(token) {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const { id } = decoded;
		return id;
	} catch (err) {
		throw new CustomUnauthorizedError("Invalid token or expired token.");
	}
}

const algorithm = process.env.PROJECT_ID_ENCRYPTION_ALGORITHM;

const key = Buffer.from(process.env.PROJECT_ID_ENCRYPTION_KEY, "base64");
const iv = Buffer.from(process.env.PROJECT_ID_ENCRYPTION_IV, "base64");

export function encryptProjectId(payload) {
	const cipher = crypto.createCipheriv(algorithm, key, iv);
	let encrypted = cipher.update(payload, "utf8", "base64");
	encrypted += cipher.final("base64");
	return encrypted;
}

export function decryptProjectId(encryptedPayload) {
	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(encryptedPayload, "base64", "utf8");
	decrypted += decipher.final("utf8");
	return decrypted;
}

export function formatProjectForResponse(projectDoc) {
	const { _id, __v, owner, randomId, apiSecret, createdAt, ...safeProject } =
		projectDoc.toObject();

	return safeProject;
}
