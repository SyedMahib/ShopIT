import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.BACKEND_URL || "http://localhost:3000"}/api/v1/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists by googleAuthId
        let user = await User.findOne({ googleAuthId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if user already exists by email
        user = await User.findOne({ email: profile.emails?.[0]?.value });

        if (user) {
          // Link Google account to existing user
          user.googleAuthId = profile.id;
          user.name = profile.displayName;
          user.avatar = {
            public_id: profile.id,
            url: profile.photos?.[0]?.value || "",
          };
          await user.save();
          return done(null, user);
        }

        // Create new user
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          avatar: {
            public_id: profile.id,
            url: profile.photos?.[0]?.value || "",
          },
          googleAuthId: profile.id,
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error as Error, null);
  }
});
