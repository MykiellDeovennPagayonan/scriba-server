import express from "express";
const router = express.Router();
import { Response, Request } from "express";
import { pool } from "../server";
import requireAuth from "../middleware/authMiddleware";

router
  .get("/", requireAuth, async (req: Request, res: Response) => {
    try {
      const client = await pool.connect();
      const result = await client.query(`
        SELECT topics.name, topics.id from topics
      `);
      res.status(200).json({ body: result.rows })
      client.release()
    } catch (error) {
      console.error("Error handling protected route:", error)
      res.status(500).json({ error: "Internal Server Error" })
    }
  })
  .get("/test", requireAuth, async (req: Request, res: Response) => {
    res.json({ message: "success" })
  })


module.exports = router;
