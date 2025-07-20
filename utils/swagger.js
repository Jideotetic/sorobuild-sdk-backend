import swaggerJsdoc from "swagger-jsdoc";

const options = {
	definition: {
		openapi: "3.1.1",
		info: {
			title: "Sorobuild SDK API",
			version: "1.0.0",
			description: "Sorobuild SDK API documentation",
		},
		components: {
			securitySchemes: {
				Authorization: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
		},
	},
	apis: ["./routes/**/*.js"],
};

const specs = swaggerJsdoc(options);

export { specs };
