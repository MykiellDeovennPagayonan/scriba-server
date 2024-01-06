import express from "express";
const router = express.Router();
import { Response, Request, NextFunction } from "express";
import { pool } from "../server";
import requireAuth from "../middleware/authMiddleware";

router
  .use(logger)
  .post("/new", requireAuth, async (req: Request, res: Response) => {
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
      res.status(201).json({ body: studyGroupId });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  })
  // .get("/", async (req: Request, res: Response) => {
  //   try {
  //     const client = await pool.connect();
  //     const response = await client.query(`SELECT * FROM study_groups`);

  //     res.status(200).json({ body: response.rows });
  //     client.release();
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).json({ error, body : [] })
  //   }
  // })
  .post("/", requireAuth, async (req: Request, res: Response) => {
    const { userId } = req.body;

    try {
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

      res.status(200).json({ authenticated: true, body: result.rows });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  })
  .post("/study-notes", requireAuth, async (req: Request, res: Response) => {
    const { userId } = req.body;

    try {
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
  
      res.status(200).json({ authenticated: true, body: result.rows });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  })
  .get("/study-notes/:id", requireAuth, async (req: Request, res: Response) => {
    const studyGroupId = req.params.id;

    try {
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

      res.status(200).json({ body: result.rows });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  })
  .get("/members/:id", requireAuth, async (req: Request, res: Response) => {
    const studyGroupId = req.params.id;

    try {
      const client = await pool.connect();

      const result = await client.query(
        `
        SELECT users.id as "userID", users.username as "username" FROM users
        INNER JOIN study_group_members
        ON users.id = study_group_members.user_id
        INNER JOIN study_groups 
        ON study_groups.id = study_group_members.study_group_id
        WHERE study_groups.id = $1
      `,
        [studyGroupId]
      );

      res.status(200).json({ body: result.rows });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  })
  .get("/admins/:id", requireAuth, async (req: Request, res: Response) => {
    const studyGroupId = req.params.id;

    try {
      const client = await pool.connect();

      const result = await client.query(
        `
        SELECT users.id as "userID", users.username as "username" FROM users
        INNER JOIN study_group_admins
        ON users.id = study_group_admins.user_id
        INNER JOIN study_groups 
        ON study_groups.id = study_group_admins.study_group_id
        WHERE study_groups.id = $1
      `,
        [studyGroupId]
      );

      res.status(200).json({ body: result.rows });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  })
  .post("/shared-notes/new", requireAuth, async (req: Request, res: Response) => {
    const { studyGroupId, studyNoteId } = req.body;

    try {
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

      res.status(201).json({ body: id });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  })
  .delete("/shared-notes/delete", requireAuth, async (req: Request, res: Response) => {
    const { id: sharedNoteID } = req.body;

    try {
      const client = await pool.connect();

      console.log(sharedNoteID);

      const result = await client.query(
        `
      DELETE FROM shared_notes
      WHERE id = $1
      `,
        [sharedNoteID]
      );

      res.status(204).json({ body: [] });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  })
  .post("/shared-notes/:id", requireAuth, async (req: Request, res: Response) => {
    const { userId } = req.body;
    const studyGroupId = req.params.id;

    try {
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

      res.status(200).json({ body: result.rows });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  })
  .delete("/leave", requireAuth, async (req: Request, res: Response) => {
    const { studyGroupId, userId } = req.body;
    try {
      const client = await pool.connect();

      const result = await client.query(
        `
        DELETE FROM study_group_members
        WHERE study_group_id = $1 AND user_id = $2
      `,
        [studyGroupId, userId]
      );

      res.status(204).json({ body: [] });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  })
  .post("/join", requireAuth, async (req: Request, res: Response) => {
    const { studyGroupId, userId } = req.body;
    const client = await pool.connect();

    try {
      const result = await client.query(
        `
        INSERT INTO study_group_members (study_group_id, user_id)
        VALUES ($1, $2)
      `,
        [studyGroupId, userId]
      );

      res.status(201).json({ body: [] });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  })
  .get("/:id", requireAuth, async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      const client = await pool.connect();
      const result = await client.query(
        `
      SELECT study_groups.name, study_groups.description  FROM study_groups WHERE study_groups.id = $1
      `,
        [id]
      );
      res.status(200).json({ body: result.rows });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  });

function logger(req: Request, res: Response, next: NextFunction) {
  console.log(req.originalUrl, "logger");
  next();
}

module.exports = router;
