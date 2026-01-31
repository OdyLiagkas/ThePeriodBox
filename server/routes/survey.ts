import { Router } from "express";
import { pool } from "../db";

const router = Router();

router.post("/survey-responses", async (req, res) => {
  const { sessionId, answers } = req.body;
  const user = req.user as any | undefined;

  if (!answers) {
    return res.status(400).json({ message: "Missing survey answers" });
  }

  const effectiveSessionId =
    sessionId ?? `user-${user?.id ?? "anonymous"}`;

  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      INSERT INTO survey_responses (user_id, session_id, answers)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id)
      DO UPDATE SET answers = EXCLUDED.answers, created_at = NOW()
      RETURNING *
      `,
      [user?.id ?? null, effectiveSessionId, answers]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Survey insert error:", err);
    res.status(500).json({ message: "Failed to save survey" });
  } finally {
    client.release();
  }
});



router.get("/survey-responses", async (req, res) => {
  const user = req.user as any | undefined;
  if (!user) return res.status(401).json({ message: "Not authenticated" });

  const client = await pool.connect();
  try {
    const result = await client.query(
      `
      SELECT id, created_at, answers
      FROM survey_responses
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [user.id]
    );

    res.json(result.rows[0] || null);
  } finally {
    client.release();
  }
});

export default router;