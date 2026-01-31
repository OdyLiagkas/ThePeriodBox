import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { User as UserType } from "@shared/models/auth";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "${process.env.AUTH_REDIRECT_URL}/api/auth/google/callback",
  },
  async (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
    try {
      // 1. Look for user by googleId
      const [existingUser] = await db.select().from(users).where(eq(users.googleId, profile.id));
      if (existingUser) return done(null, existingUser);

      // 2. Not found? Create a real user in Neon
      const [newUser] = await db.insert(users).values({
        googleId: profile.id,
        email: profile.emails?.[0].value,
        firstName: profile.name?.givenName,
        lastName: profile.name?.familyName,
        profileImageUrl: profile.photos?.[0].value,
      }).returning();
      
      done(null, newUser);
    } catch (err) {
      done(err);
    }
  }
));

// This stores just the user ID in the session cookie
passport.serializeUser((user: any, done) => done(null, user.id));

// This fetches the full user from the DB on every request
passport.deserializeUser(async (id: string, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    done(null, user);
  } catch (err) {
    done(err);
  }
});