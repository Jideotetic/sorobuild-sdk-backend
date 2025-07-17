import passport from "passport";
import { User } from "../schemas/user.js";

passport.use(
	new LocalStrategy(async (email, password, done) => {
		try {
			const user = await User.findOne({ email });

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				return done(null, false, { message: "Incorrect password" });
			}

			return done(null, user);
		} catch (err) {
			return done(err);
		}
	})
);
