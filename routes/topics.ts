import express from "express";
const router = express.Router();
import { Response, Request } from "express";
import { pool } from "../server";
import requireAuth from "../middleware/authMiddleware";

router
  .get("/", requireAuth, async (req: Request, res: Response) => {
    const client = await pool.connect()
    const result = await client.query(`
    SELECT topics.name, topics.id from topics
    `);
    res.json({ authenticated: true, body: result.rows });
    client.release()
  })
  .get("/burgers", async (req: Request, res: Response) => {
    const client = await pool.connect()
    const result = await client.query(`
    SELECT topics.name, topics.id from topics
    `);
    res.json({ authenticated: true, body: "I love burgers" });
    client.release()
  })


module.exports = router;
