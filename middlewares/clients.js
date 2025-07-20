const trustedClients = ["https://soro.build", "http://localhost:5173"];

export function isTrustedClient(req) {
	const origin = req.headers.origin;
	return trustedClients.includes(origin);
}
