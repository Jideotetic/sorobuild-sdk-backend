import express from "express";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger.js";
import authRouter from "./routes/auth-router/authRouter.js";
import { connectToMongoDB } from "./model/db.js";
import cors from "cors";
import projectRouter from "./routes/project-router/projectRouter.js";
import "./middlewares/passport.js";
import CustomBadRequestError from "./errors/customBadRequestError.js";
import passport from "passport";
import CustomUnauthorizedError from "./errors/customUnauthorizedError.js";

const app = express();

await connectToMongoDB();

const corsOptions = {
	origin: "http://example.com",
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
		explorer: true,
		// customCssUrl:
		// 	"https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
	})
);

app.use("/auth", authRouter);
app.use(
	"/project",
	async (req, res, next) => {
		passport.authenticate("jwt", { session: false }, (err, user, info) => {
			if (err || !user) {
				const message = info.message;
				next(new CustomUnauthorizedError(JSON.stringify(message)));
			}
			req.user = user;
			next();
		})(req, res, next);
	},
	projectRouter
);

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
