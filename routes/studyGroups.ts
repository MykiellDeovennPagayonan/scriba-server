import express from "express";
const router = express.Router();
import { Response, Request, NextFunction } from "express";
import { pool } from "../server";

// router.all('/api/*', requireAuthentication)

router
  .use(logger)
  .post("/new", async (req: Request, res: Response) => {
    const { studyGroupName, studyGroupDescription, userId } = req.body;

    try {
      const client = await pool.connect()
      const response = await client.query(
        `INSERT INTO study_groups (name, description)
        VALUES ($1, $2)
        RETURNING id
        `,
        [studyGroupName, studyGroupDescription]
      );

      const studyGroupId = response.rows[0].id

      await client.query(`
      INSERT INTO study_group_admins (study_group_id, user_id)
      VALUES ($1, $2)
      `, [studyGroupId, userId])
      res.json({
        message: "success",
      });
      client.release()
    } catch (err) {
      console.log(err);
    }
  })
  .get("/", async (req: Request, res: Response) => {
    try {
      const client = await pool.connect()
      const response = await client.query(`SELECT * FROM study_groups`);
      const rows = response.rows;

      res.json(rows);
      client.release()
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .post("/", async (req: Request, res: Response) => {
    const { userId } = req.body
    const client = await pool.connect()

    const result = await client.query(`
    SELECT study_groups.id as id, study_groups.name as name, study_groups.description as description
    FROM study_groups
    LEFT JOIN study_group_admins
    ON study_groups.id = study_group_admins.study_group_id
    LEFT JOIN study_group_members
    ON study_groups.id = study_group_members.study_group_id
    WHERE (study_group_members.user_id = $1 OR study_group_admins.user_id = $1)
    `, [ userId ]
    );

    console.log(result.rows)
    res.json({ authenticated: true, body: result.rows });
    client.release()
  })

function logger(req: Request, res: Response, next: NextFunction) {
  console.log(req.originalUrl, "logger");
  next();
}

module.exports = router;
