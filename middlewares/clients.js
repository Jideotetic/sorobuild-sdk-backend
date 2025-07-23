const trustedClients = ["https://soro.build", "http://localhost:5173"];

export function isTrustedClient(req) {
	const origin = req.headers.origin || req.headers.referer;

	console.log({ origin });

	const parsedOrigin = new URL(origin).origin;

	console.log(trustedClients.includes(parsedOrigin));
	return trustedClients.includes(parsedOrigin);
}
