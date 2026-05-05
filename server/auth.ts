import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import { User as UserType } from "@shared/models/auth";

declare global {
  namespace Express {
    interface User extends UserType {}
  }
}

// Shared verify function (same logic for both)
const googleVerify = async (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
  try {
    const [existingUser] = await db.select().from(users).where(eq(users.googleId, profile.id));
    if (existingUser) return done(null, existingUser);

    const [newUser] = await db.insert(users).values({
      id: crypto.randomUUID(),
      googleId: profile.id,
      facebookId: null,
      email: profile.emails?.[0].value,
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      profileImageUrl: profile.photos?.[0].value,
    }).returning();
    
    done(null, newUser);
  } catch (err) {
    done(err);
  }
};

const facebookVerify = async (_accessToken: any, _refreshToken: any, profile: any, done: any) => {
  try {
    // Check by facebookId first
    let [user] = await db.select().from(users).where(eq(users.facebookId, profile.id));
    
    if (!user) {
      // Check by email to merge with existing account
      const email = profile.emails?.[0]?.value;
      if (email) {
        [user] = await db.select().from(users).where(eq(users.email, email));
      }
    }

    if (user) {
      // Backfill facebookId if they previously signed in with Google
      if (!user.facebookId) {
        await db.update(users).set({ facebookId: profile.id }).where(eq(users.id, user.id));
      }
      return done(null, user);
    }

    const [newUser] = await db.insert(users).values({
      id: crypto.randomUUID(),
      googleId: null,
      facebookId: profile.id,
      email: profile.emails?.[0]?.value,
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      profileImageUrl: profile.photos?.[0]?.value,
    }).returning();

    done(null, newUser);
  } catch (err) {
    done(err);
  }
};

// Strategy 1: Regular login → goes to /account
passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.AUTH_REDIRECT_URL}/api/auth/google/callback`,
  },
  googleVerify
));

// Strategy 2: Survey login → goes to /survey
passport.use("google-survey", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: `${process.env.AUTH_REDIRECT_URL}/api/auth/google/callback2`,
  },
  googleVerify
));

passport.use("facebook", new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID!,
  clientSecret: process.env.FACEBOOK_APP_SECRET!,
  callbackURL: `${process.env.AUTH_REDIRECT_URL}/api/auth/facebook/callback`,
  profileFields: ["id", "emails", "name", "photos"],
}, facebookVerify));

// Strategy 2: Survey login → goes to /survey
passport.use("facebook-survey", new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID!,
  clientSecret: process.env.FACEBOOK_APP_SECRET!,
  callbackURL: `${process.env.AUTH_REDIRECT_URL}/api/auth/facebook/callback-survey`,
  profileFields: ["id", "emails", "name", "photos"],
}, facebookVerify));

passport.serializeUser((user: any, done) => done(null, user.id));

passport.deserializeUser(async (id: string, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    done(null, user);
  } catch (err) {
    done(err);
  }
});