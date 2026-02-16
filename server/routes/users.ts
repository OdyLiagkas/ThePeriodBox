import { Router } from "express";
import { pool } from "../db";

const router = Router();

// Add to server/routes/survey.ts or create server/routes/users.ts

router.delete("/user", async (req, res) => {
  const user = req.user as any | undefined;

  if (!user?.id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const client = await pool.connect();

  try {
    // Start a transaction
    await client.query('BEGIN');

    // Delete from people_to_notify first (foreign key constraint)
    await client.query(
      "DELETE FROM people_to_notify WHERE user_id = $1",
      [user.id]
    );

    // Delete from survey_responses
    await client.query(
      "DELETE FROM survey_responses WHERE user_id = $1",
      [user.id]
    );

    // Finally delete the user
    const result = await client.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [user.id]
    );

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: "User not found" });
    }

    // Commit transaction
    await client.query('COMMIT');

    // Logout the user
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
      }
      res.json({ success: true, message: "Account deleted successfully" });
    });

  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error("Delete account error:", err);
    res.status(500).json({
      message: "Failed to delete account",
      error: err.message,
    });
  } finally {
    client.release();
  }
});

export default router;