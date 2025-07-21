import express from "express";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import { specs } from "./utils/swagger.js";

import { connectToMongoDB } from "./model/db.js";

import authRouter from "./routes/authRouter.js";
import projectRouter from "./routes/projectRouter.js";
import rpcCreditsRouter from "./routes/rpcCreditsRouter.js";
import rpcRouter from "./routes/rpcRouter.js";
import horizonRouter from "./routes/horizonRouter.js";

import CustomBadRequestError from "./errors/customBadRequestError.js";
import CustomNotFoundError from "./errors/customNotFoundError.js";

import {
	verifyAuthorizationToken,
	verifyIdToken,
} from "./middlewares/guards.js";

import "./middlewares/passport.js";

const app = express();

await connectToMongoDB();

// Cors stuff
const allowedOrigins = [
	"https://soro.build",
	"http://localhost:5173",
	"http://localhost:3000",
	"https://sorobuild-sdk-backend.onrender.com",
];

const corsOptions = {
	origin: function (origin, callback) {
		if (!origin) return callback(null, true);
		if (allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	optionsSuccessStatus: 200,
	credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// API endpoints
app.use("/auth", authRouter);
app.use("/project", verifyAuthorizationToken, verifyIdToken, projectRouter);
app.use(
	"/rpc-credits",
	verifyAuthorizationToken,
	verifyIdToken,
	rpcCreditsRouter
);

// app.use(
// 	"/service",
// 	// verifyAuthorizationToken,
// 	// verifyIdToken,
// 	rpcHorizonRouter
// );

app.use(
	"/rpc",
	// verifyAuthorizationToken,
	// verifyIdToken,
	rpcRouter
);

app.use(
	"/horizon",
	// verifyAuthorizationToken,
	// verifyIdToken,
	horizonRouter
);

// Catch all route
app.all("/", verifyAuthorizationToken, verifyIdToken, (req, res, next) => {
	const error = new CustomNotFoundError(`Route ${req.originalUrl} not found`);
	next(error);
});

app.all(
	"/*splat",
	verifyAuthorizationToken,
	verifyIdToken,
	(req, res, next) => {
		const error = new CustomNotFoundError(`Route ${req.originalUrl} not found`);
		next(error);
	}
);

// Error handlers
app.use((err, req, res, next) => {
	if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
		return next(
			new CustomBadRequestError(
				"Invalid payload. Please check your request body format."
			)
		);
	}
	next(err);
});

app.use((err, req, res, next) => {
	console.error(err);

	let message;

	try {
		message = JSON.parse(err.message);
	} catch {
		message = err.message || "Something went wrong";
	}

	res.status(err.statusCode || 500).json({
		statusCode: err.statusCode || 500,
		name: err.name || "InternalServerError",
		message,
	});
});

app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
