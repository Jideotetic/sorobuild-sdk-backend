class CustomTooManyRequestError extends Error {
	constructor(message) {
		super(message);
		this.statusCode = 429;
		this.name = "TooManyRequestError";
	}
}

export default CustomTooManyRequestError;
