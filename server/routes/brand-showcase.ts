// server/routes/brand-showcase.ts
// Mount this in server/index.ts with:
//   import brandShowcaseRouter from "./routes/brand-showcase";
//   app.use("/api", brandShowcaseRouter);

import { Router, Request, Response } from "express";
import { pool } from "../db"; // adjust this import to wherever your pg Pool/client lives

const router = Router();

/**
 * GET /api/brand-showcase
 * Returns all brand_showcase rows for the currently authenticated user.
 * Returns [] if no rows exist (so the frontend can hide the section cleanly).
 */
router.get("/brand-showcase", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = req.user as any;
  const userId = user.id;

  try {
    const result = await pool.query(
      `SELECT id, brand_info, products, created_at
       FROM brand_showcase
       WHERE user_id = $1
       ORDER BY created_at ASC`,
      [userId]
    );

    res.json(result.rows); // array of { id, brand_info, products, created_at }
  } catch (err) {
    console.error("[brand-showcase] DB error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
