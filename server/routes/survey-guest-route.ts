// server/routes/survey-guest.ts
//
// Mount this in server/index.ts alongside your existing surveyRouter:
//
//   import surveyGuestRouter from "./routes/survey-guest";
//   app.use("/api", surveyGuestRouter);
//
// This file assumes you already have:
//   - db (drizzle instance) exported from ./db
//   - users and surveyResponses tables in @shared/schema
//   - surveyResponses has columns: id, userId, answers, createdAt

import express from "express";
import { db } from "../db";
import { users, surveyResponses } from "@shared/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

router.post("/survey-responses/guest", async (req, res) => {
  try {
    const { firstName, lastName, email, answers } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !answers) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    // Check if a guest with this email already submitted — if so, reuse their user row
    // so we don't create duplicate guest accounts for the same person.
    let userId: string;
    const [existingGuest] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingGuest) {
      userId = existingGuest.id;
    } else {
      // Create a new guest user with null OAuth IDs
      const [newUser] = await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          googleId: null,
          facebookId: null,
          email,
          firstName,
          lastName,
          profileImageUrl: null,
        })
        .returning();
      userId = newUser.id;
    }

    // Save the survey response linked to this guest user
    const [response] = await db
      .insert(surveyResponses)
      .values({
        id: crypto.randomUUID(),
        userId,
        answers,
        createdAt: new Date(),
      })
      .returning();

    return res.status(201).json({ success: true, responseId: response.id });
  } catch (err: any) {
    console.error("Guest survey submission error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

export default router;
