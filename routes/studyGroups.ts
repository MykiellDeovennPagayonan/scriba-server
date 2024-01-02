import express from "express";
const router = express.Router();
import { Response, Request, NextFunction } from "express";
import { pool } from "../server";

// router.all('/api/*', requireAuthentication)

router
  .use(logger)
  .get("/", async (req: Request, res: Response) => {
    try {
      const client = await pool.connect()
      const response = await client.query(`SELECT * FROM study_groups`);
      const rows = response.rows;

      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .post("/new", async (req: Request, res: Response) => {
    const { studyGroupName, studyGroupDescription } = req.body;

    try {
      const client = await pool.connect()
      const response = await client.query(
        `INSERT INTO study_groups (name, description)
        VALUES ($1, $2)
        `,
        [studyGroupName, studyGroupDescription]
      );
      res.json({
        message: "success",
      });
    } catch (err) {
      console.log(err);
    }
  });

function logger(req: Request, res: Response, next: NextFunction) {
  console.log(req.originalUrl, "logger");
  next();
}

module.exports = router;
