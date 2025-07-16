import swaggerJsdoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.1.1",
		info: {
			title: "Sorobuild SDK API",
			version: "1.0.0",
			description: "Sorobuild SDK API documentation",
		},
		servers: [
			{
				url: `http://localhost:${process.env.PORT || 3000}`,
			},
		],
	},
	apis: ["./routes/**/*.js"],
};

const specs = swaggerJsdoc(options);

export default specs;
