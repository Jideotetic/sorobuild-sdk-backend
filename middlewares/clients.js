const trustedClients = ["https://soro.build", "http://localhost:5173"];

export function isTrustedClient(req) {
	const origin = req.headers.origin || req.headers.referer;

	console.log(origin);
	const parsedOrigin = new URL(origin).origin;
	return trustedClients.includes(parsedOrigin);
}
