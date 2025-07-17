import express from "express";
import swaggerUi from "swagger-ui-express";
import { specs } from "./swagger.js";
import authRouter from "./routes/auth-router/authRouter.js";
import { connectToMongoDB } from "./model/db.js";

const app = express();

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

await connectToMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.statusCode || 500).json({
		statusCode: err.statusCode || 500,
		name: err.name || "InternalServerError",
		message: JSON.parse(err.message) || "Something went wrong",
	});
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
