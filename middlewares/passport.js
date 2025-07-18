import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { User } from "../schemas/user.js";
import { Project } from "../schemas/project.js";
import bcrypt from "bcryptjs";

passport.use(
	"signup",
	new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true,
		},
		async (req, email, password, done) => {
			const { name } = req.body;

			try {
				const existingUser = await User.findOne({ email });

				if (existingUser) {
					return done(null, false, {
						message: "User already exist...Kindly sign in",
					});
				}

				const newUser = new User({
					email,
					name,
					password,
					authProviders: ["email"],
				});

				await newUser.save();

				const newProject = new Project({
					owner: newUser._id,
				});

				await newProject.save();

				newUser.projects.push(newProject._id);
				await newUser.save();

				const user = await User.findOne(newUser._id).populate("projects");

				return done(null, user, { message: "User created successfully" });
			} catch (err) {
				return done(err);
			}
		}
	)
);

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
