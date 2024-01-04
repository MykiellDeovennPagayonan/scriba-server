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
      const client = await pool.connect();
      const response = await client.query(
        `INSERT INTO study_groups (name, description)
        VALUES ($1, $2)
        RETURNING id
        `,
        [studyGroupName, studyGroupDescription]
      );

      const studyGroupId = response.rows[0].id;

      await client.query(
        `
      INSERT INTO study_group_admins (study_group_id, user_id)
      VALUES ($1, $2)
      `,
        [studyGroupId, userId]
      );
      res.json({
        message: "success",
      });
      client.release();
    } catch (err) {
      console.log(err);
    }
  })
  .get("/", async (req: Request, res: Response) => {
    try {
      const client = await pool.connect();
      const response = await client.query(`SELECT * FROM study_groups`);
      const rows = response.rows;

      res.json(rows);
      client.release();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
  .post("/", async (req: Request, res: Response) => {
    const { userId } = req.body;
    const client = await pool.connect();

    const result = await client.query(
      `
    SELECT study_groups.id as id, study_groups.name as name, study_groups.description as description
    FROM study_groups
    LEFT JOIN study_group_admins
    ON study_groups.id = study_group_admins.study_group_id
    LEFT JOIN study_group_members
    ON study_groups.id = study_group_members.study_group_id
    WHERE (study_group_members.user_id = $1 OR study_group_admins.user_id = $1)
    `,
      [userId]
    );

    console.log(result.rows);
    res.json({ authenticated: true, body: result.rows });
    client.release();
  })
  .post("/study-notes", async (req: Request, res: Response) => {
    const { userId } = req.body;
    const client = await pool.connect();

    const result = await client.query(
      `
    SELECT study_notes.title, study_notes.id
    from users
    INNER JOIN study_notes
    ON users.id = study_notes.user_id
    WHERE (users.id = $1 AND study_notes.is_public = true)
    `,
      [userId]
    );

    console.log(result.rows);
    res.json({ authenticated: true, body: result.rows });
    client.release();
  })
  .get("/study-notes/:id", async (req: Request, res: Response) => {
    const studyGroupId = req.params.id;
    const client = await pool.connect();

    const result = await client.query(
      `
    SELECT
      study_notes.title,
		  topics.name as "topicName",
		  study_notes.id as "studyNoteId",
		  users.username as "userName"
    FROM study_groups
    INNER JOIN shared_notes
    ON study_groups.id = shared_notes.study_group_id
    INNER JOIN study_notes
    ON shared_notes.study_note_id = study_notes.id
    INNER JOIN study_note_topics
    ON study_notes.id = study_note_topics.study_notes_id
    INNER JOIN topics
	  ON study_note_topics.topic_id = topics.id
	  INNER JOIN users
	  ON users.id = study_notes.user_id
    WHERE study_groups.id = $1
    `,
      [studyGroupId]
    );

    console.log(result.rows);
    res.json({ authenticated: true, body: result.rows });
    client.release();
  })
  .post("/shared-notes/new", async (req: Request, res: Response) => {
    const { studyGroupId, studyNoteId } = req.body;
    const client = await pool.connect();

    const result = await client.query(
      `
    INSERT INTO shared_notes (study_group_id, study_note_Id)
    VALUES ($1, $2)
    RETURNING id
    `,
      [studyGroupId, studyNoteId]
    );

    const id = result.rows[0].id;

    res.json({ authenticated: true, body: id });
    client.release();
  })
  .delete("/shared-notes/delete", async (req: Request, res: Response) => {
    const { id: sharedNoteID } = req.body;
    const client = await pool.connect();

    console.log(sharedNoteID);

    const result = await client.query(
      `
    DELETE FROM shared_notes
    WHERE id = $1
    `,
      [sharedNoteID]
    );

    res.json({ authenticated: true, body: null });
    client.release();
  })
  .post("/shared-notes/:id", async (req: Request, res: Response) => {
    const { userId } = req.body;
    const studyGroupId = req.params.id;
    const client = await pool.connect();

    const result = await client.query(
      `
    SELECT study_notes.id as "studyNoteId", shared_notes.id as "id"
    FROM study_groups
    INNER JOIN shared_notes
    ON study_groups.id = shared_notes.study_group_id
    INNER JOIN study_notes
    ON study_notes.id = shared_notes.study_note_id
    INNER JOIN users
    ON study_notes.user_id = users.id
    WHERE users.id = $1 AND study_groups.id = $2
    `,
      [userId, studyGroupId]
    );

    res.json({ authenticated: true, body: result.rows });
    client.release();
  })
  .get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    const client = await pool.connect();
    const result = await client.query(
      `
    SELECT study_groups.name FROM study_groups WHERE study_groups.id = $1
    `,
      [id]
    );
    res.json({ authenticated: true, body: result.rows[0].name });
    client.release();
  });

function logger(req: Request, res: Response, next: NextFunction) {
  console.log(req.originalUrl, "logger");
  next();
}

module.exports = router;
