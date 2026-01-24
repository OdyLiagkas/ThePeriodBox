import { Router } from "express";
import { pool } from "../db";

const router = Router();

router.post("/survey-responses", async (req, res) => {
  const { sessionId, answers } = req.body;
  const user = req.user as any | undefined;

  if (!sessionId || !answers) {
    return res.status(400).json({ message: "Missing survey data" });
  }

  const client = await pool.connect();
  try {
    await client.query(
      `
      INSERT INTO survey_responses (user_id, session_id, answers)
      VALUES ($1, $2, $3)
      `,
      [user?.id ?? null, sessionId, answers]
    );

    res.json({ ok: true });
  } finally {
    client.release();
  }
});

export default router;
