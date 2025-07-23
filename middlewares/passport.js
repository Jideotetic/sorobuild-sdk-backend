import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../schemas/user.js";
import { Project } from "../schemas/project.js";
import { Strategy as JWTstrategy, ExtractJwt } from "passport-jwt";
import { extractIdToken } from "../utils/lib.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
	"signin",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
		},
		async (email, password, done) => {
			try {
				const user = await User.findOne({ email });

				if (!user) {
					return done(null, false, {
						message: "No user found ...Kindly sign up",
					});
				}

				if (!user.isVerified) {
					return done(null, false, {
						message:
							"Kindly verify you account with the link sent to your email",
					});
				}

				const validate = await user.isValidPassword(password);

				if (!validate) {
					return done(null, false, { message: "Wrong password" });
				}

				return done(null, user, { message: "Sign in successfully" });
			} catch (error) {
				return done(error);
			}
		}
	)
);

passport.use(
	"id-jwt",
	new JWTstrategy(
		{
			secretOrKey: process.env.JWT_SECRET,
			jwtFromRequest: extractIdToken,
		},
		async (token, done) => {
			try {
				return done(null, token.user);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	"app-jwt",
	new JWTstrategy(
		{
			secretOrKey: process.env.JWT_SECRET,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
		},
		async (token, done) => {
			try {
				return done(null, token.type);
			} catch (error) {
				return done(error, false);
			}
		}
	)
);

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const email = profile.emails?.[0]?.value;

				// 1. Try existing user with googleId
				let userByGoogleId = await User.findOne({ googleId: profile.id });
				if (userByGoogleId) {
					return done(null, userByGoogleId, {
						message: "Signed in with Google Successfully",
					});
				}

				// 2. Try existing user with email
				let userByEmail = await User.findOne({ email });

				if (userByEmail) {
					// Safety check: if the user already has a googleId that doesn’t match current profile
					if (userByEmail.googleId && userByEmail.googleId !== profile.id) {
						return done(null, false, {
							message:
								"This Google account does not match the existing linked Google account.",
						});
					}

					// Otherwise, link Google to this account
					userByEmail.googleId = profile.id;
					if (!userByEmail.authProviders.includes("google")) {
						userByEmail.authProviders.push("google");
					}
					await userByEmail.save();
					return done(null, userByEmail, {
						message: "Linked Google to existing account",
					});
				}

				const newUser = new User({
					email,
					name: profile.displayName,
					googleId: profile.id,
					authProviders: ["google"],
					isVerified: true,
				});

				await newUser.save();

				const newProject = new Project({
					owner: newUser._id,
					whitelistedDomain: "",
				});
				await newProject.save();

				newUser.projects.push(newProject._id);
				await newUser.save();

				const populatedUser = await User.findById(newUser._id).populate(
					"projects"
				);
				return done(null, populatedUser, {
					message: "Google signup successful",
				});
			} catch (err) {
				console.error("Google Strategy Error:", err);
				return done(err);
			}
		}
	)
);
