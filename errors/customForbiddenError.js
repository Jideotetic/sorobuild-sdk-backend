class CustomForbiddenError extends Error {
	constructor(message) {
		super(message);
		this.statusCode = 403;
		this.name = "ForbiddenError";
	}
}

export default CustomForbiddenError;
