import { Router } from "express";
import { pool } from "../db";

const router = Router();

router.post("/survey-responses", async (req, res) => {
  const { sessionId, answers } = req.body;
  const user = req.user as any | undefined;

  if (!answers) {
    return res.status(400).json({ message: "Missing survey answers" });
  }

  const client = await pool.connect();
  try {
    // If user is logged in, save user_id, else fallback to session_id
    await client.query(
      `
      INSERT INTO survey_responses (user_id, session_id, answers)
      VALUES ($1, $2, $3)
      `,
      [user?.id ?? null, user ? null : sessionId, answers]
    );

    res.json({ ok: true });
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
      SELECT * FROM survey_responses
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
