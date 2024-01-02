import express from "express";
const router = express.Router();
import { Response, Request } from "express";
import { client } from "../server";
import requireAuth from "../middleware/authMiddleware";

router
  .get("/", requireAuth, async (req: Request, res: Response) => {
    const result = await client.query(`
    SELECT topics.name, topics.id from topics
    `);
    res.json({ authenticated: true, body: [] });
  })


module.exports = router;
