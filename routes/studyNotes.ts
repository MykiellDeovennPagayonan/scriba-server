import express from "express";
const router = express.Router();
import { Response, Request } from "express";
import { pool } from "../server";
import requireAuth from "../middleware/authMiddleware";

const notesRouter = require('./study-notes/notes')
const quizzesRouter = require('./study-notes/quizzes')

interface Topic {
  name: string;
  id: number;
}

interface CreateStudyNoteRequest {
  userId: number;
  title: string;
  topics: Array<Topic>;
  isPublic: boolean;
}

router
  .use("/notes", notesRouter)
  .use("/quizzes", quizzesRouter)
  .post("/new", async (req: Request, res: Response) => {
    const { userId, title, topics, isPublic }: CreateStudyNoteRequest =
      req.body;

    try {
      const client = await pool.connect()
      const result = await client.query(
        `
        INSERT INTO study_notes (user_id, date_published, title, is_public, study_notes_edited_date)
        VALUES ($1, NOW(), $2, $3, NOW())
        RETURNING id
        `,
        [userId, title, isPublic]
      );

      const studyNoteID = result.rows[0].id;

      let queryValuesHolder = "";
      let queryValues: Array<number> = [];

      for (let i = 0; i < topics.length; i++) {
        queryValuesHolder += `($${i * 2 + 1}, $${i * 2 + 2})`;
        queryValues.push(topics[i].id);
        queryValues.push(studyNoteID);

        if (i < topics.length - 1) {
          queryValuesHolder += `,`;
        }
      }

      const response = await client.query(
        `
        INSERT INTO study_note_topics (topic_id, study_notes_id)
        VALUES ${queryValuesHolder}
        RETURNING id
        `,
        queryValues
      );

      res.json({ authenticated: true, body: studyNoteID });
      client.release()
    } catch (error) {
      console.log("Error:", error);
    }
  })
  .delete("/delete", async (req: Request, res: Response) => {
    const { id: studyNoteID } = req.body
    const client = await pool.connect()

    console.log(studyNoteID)

    const result = await client.query(`
    DELETE FROM study_notes
    WHERE id = $1
    `, [ studyNoteID ]
    )
    
    res.json({ authenticated: true, body: result.rows });
    client.release()
  })
  .post("/", async (req: Request, res: Response) => {
    const { userId } = req.body
    const client = await pool.connect()

    const result = await client.query(`
    SELECT study_notes.title, topics.name as "topicName", study_notes.id as "studyNoteId"
    from users
    INNER JOIN study_notes
    ON users.id = study_notes.user_id
    INNER JOIN study_note_topics
    ON study_notes.id = study_note_topics.study_notes_id
    INNER JOIN topics ON study_note_topics.topic_id = topics.id
    WHERE users.id = $1
    `, [ userId ]
    );
    res.json({ authenticated: true, body: result.rows });
    client.release()
  })
  .get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    const client = await pool.connect()
    const result = await client.query(`
    SELECT study_notes.title, study_notes.is_public as "isPublic" FROM study_notes WHERE study_notes.id = $1
    `, [id]);
    res.json({ authenticated: true, body: result.rows });
    client.release()
  })

module.exports = router;
