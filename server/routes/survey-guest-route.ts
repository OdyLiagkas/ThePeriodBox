// server/routes/survey-guest.ts
//
// Add to server/index.ts:
//   import surveyGuestRouter from "./routes/survey-guest";
//   app.use("/api", surveyGuestRouter);

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

    // Reuse existing user row if this email already exists
    let userId: string;
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create guest user — googleId and facebookId are omitted (null in DB)
      const newId = crypto.randomUUID();
      await db.insert(users).values({
        id: newId,
        email,
        firstName,  // maps to "first_name" column via Drizzle schema
        lastName,   // maps to "last_name" column via Drizzle schema
      });
      userId = newId;
    }

    // Insert survey response — sessionId defaults to "" per schema, id defaults via gen_random_uuid()
    const [response] = await db
      .insert(surveyResponses)
      .values({
        sessionId: "",
        userId,
        answers,
      })
      .returning();

    return res.status(201).json({ success: true, responseId: response.id });
  } catch (err: any) {
    console.error("Guest survey submission error:", err);
    // Return the real error message so you can debug easily
    return res.status(500).json({ message: err.message || "Internal server error." });
  }
});

export default router;