import express from "express";
import swaggerUi from "swagger-ui-express";
import { specs } from "./utils/swagger.js";
import authRouter from "./routes/auth-route/authRouter.js";
import { connectToMongoDB } from "./model/db.js";
import cors from "cors";
import projectRouter from "./routes/project-route/projectRouter.js";
import "./middlewares/passport.js";
import CustomBadRequestError from "./errors/customBadRequestError.js";
import rpcCreditsRouter from "./routes/rpc-credits-route/rpcCreditsRouter.js";
import { authenticateAppUser, authenticateUser } from "./middlewares/guards.js";
import rpcHorizonRouter from "./routes/rpc-horizon-route/rpcHorizonRouter.js";

const app = express();

await connectToMongoDB();

const corsOptions = {
	origin: "https://rust-ide-five.vercel.app",
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(specs, {
		// explorer: true,
		// customCssUrl:
		// 	"https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
	})
);

app.use("/auth", authRouter);
app.use("/project", authenticateAppUser, authenticateUser, projectRouter);
app.use(
	"/rpc-credits",
	authenticateAppUser,
	authenticateUser,
	rpcCreditsRouter
);
app.use("/rpc-horizon", rpcHorizonRouter);

app.all("/", authenticateAppUser, authenticateUser, (req, res, next) => {
	const error = new CustomBadRequestError(`Route ${req.originalUrl} not found`);
	next(error);
});

app.all("/*splat", authenticateAppUser, authenticateUser, (req, res, next) => {
	const error = new CustomBadRequestError(`Route ${req.originalUrl} not found`);
	next(error);
});

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
