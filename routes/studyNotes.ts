import express from "express";
const router = express.Router();
import { Response, Request, NextFunction } from "express";
import { client } from "../server";
import requireAuth from "../middleware/authMiddleware";

interface Topic {
  name: string,
  id: number
}

interface CreateStudyNoteRequest {
  title: string;
  topics: Array<Topic>;
  isPublic: boolean;
}

router
  .get("/", requireAuth, async (req: Request, res: Response) => {
    const result = await client.query(`
  SELECT topics.name, topics.id from topics
  `);
    res.json({ authenticated: true, body: result.rows });
  })
  .post("/", async (req: Request, res: Response) => {
    const { title, topics, isPublic }: CreateStudyNoteRequest = req.body;

    try {
      const id = await client.query(
        `
      INSERT INTO study_notes (date_published, title, is_public, study_notes_edited_date)
      VALUES (NOW(), $1, $2, NOW())
      RETURNING id
      `,
        [title, isPublic]
      );

      const studyNoteID = id.rows[0].id;

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

      console.log(queryValuesHolder);
      console.log(queryValues);

      const response = await client.query(
        `
      INSERT INTO study_note_topics (topic_id, study_notes_id)
      VALUES ${queryValuesHolder}
      RETURNING id
      `,
        queryValues
      )

      return res.json({ message: studyNoteID });
    } catch (error) {
      console.log("Error:", error);
    }

    res.json({ authenticated: true, body: "hello" });
  });

module.exports = router;