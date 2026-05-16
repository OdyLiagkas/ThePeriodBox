import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.get("/brand-showcase", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = req.user as any;
  const userId = user.id;

  console.log("[brand-showcase] fetching for user:", userId);

  try {
    const result = await pool.query(
      `SELECT id, brand_info, products, created_at
       FROM brand_showcase
       WHERE user_id = $1
       ORDER BY created_at ASC`,
      [userId]
    );
    console.log("[brand-showcase] rows found:", result.rows.length);
    return res.json(result.rows);
  } catch (err) {
    console.error("[brand-showcase] DB error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;