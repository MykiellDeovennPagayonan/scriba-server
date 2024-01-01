import express from "express";
const router = express.Router();
import { Response, Request } from "express";
import { client } from "../server";
import requireAuth from "../middleware/authMiddleware";

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
  .post("/new", async (req: Request, res: Response) => {
    const { userId, title, topics, isPublic }: CreateStudyNoteRequest =
      req.body;

    try {
      const id = await client.query(
        `
    INSERT INTO study_notes (user_id, date_published, title, is_public, study_notes_edited_date)
    VALUES ($1, NOW(), $2, $3, NOW())
    RETURNING id
    `,
        [userId, title, isPublic]
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

      const response = await client.query(
        `
        INSERT INTO study_note_topics (topic_id, study_notes_id)
        VALUES ${queryValuesHolder}
        RETURNING id
        `,
        queryValues
      );

      return res.json({ message: studyNoteID });
    } catch (error) {
      console.log("Error:", error);
    }
    res.json({ authenticated: true, body: "hello" });
  })
  .post("/:id", async (req: Request, res: Response) => {
    const { sentences } = req.body;

    const studyNoteId = sentences[0]?.studyNoteId 

    let queryValuesHolder = "";
    let queryValues: Array<number> = [];

    for (let i = 0; i < sentences.length; i++) {
      queryValuesHolder += `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`;
      queryValues.push(sentences[i].id);
      queryValues.push(sentences[i].text);
      queryValues.push(sentences[i].type)
      queryValues.push(Number(sentences[i].studyNoteId))

      if (i < sentences.length - 1) {
        queryValuesHolder += `,`;
      }
    }

    console.log(queryValues)
    console.log(queryValuesHolder)

    await client.query(`
    DELETE FROM sentences
    WHERE sentences.study_note_id = $1::integer
    `, [ studyNoteId ]
    )

    await client.query(`
    INSERT INTO sentences (id, text, type, study_note_id)
    VALUES ${queryValuesHolder}
    `, queryValues
    )

    res.json({ authenticated: true, body: "Blehhh" })
  })
  .get("/:id", requireAuth, async (req: Request, res: Response) => {
    const id = req.params.id;

    const results = await client.query(`
    SELECT * from sentences WHERE sentences.study_note_id = $1
    `, [id]
    )


    res.json({ authenticated: true, body: results.rows })
  })
  .post("/", requireAuth, async (req: Request, res: Response) => {
    const { userId } = req.body

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
  })

module.exports = router;
