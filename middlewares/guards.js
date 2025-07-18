import passport from "passport";

export const authenticateAppUser = (req, res, next) => {
	passport.authenticate("app-jwt", { session: false }, (err, type, info) => {
		if (err || !type) {
			const message = info?.message || "Unauthorized";
			return next(new CustomUnauthorizedError(JSON.stringify(message)));
		}
		req.type = type;
		next();
	})(req, res, next);
};

export const authenticateUser = (req, res, next) => {
	passport.authenticate("id-jwt", { session: false }, (err, user, info) => {
		if (err || !user) {
			const message = info?.message || "Unauthorized";
			return next(new CustomUnauthorizedError(JSON.stringify(message)));
		}
		req.user = user;
		next();
	})(req, res, next);
};
