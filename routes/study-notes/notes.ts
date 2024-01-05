import express from "express";
const router = express.Router();
import { Response, Request } from "express";
import { pool } from "../../server";
import requireAuth from "../../middleware/authMiddleware";

router
  .post("/:id", requireAuth, async (req: Request, res: Response) => {
    const { sentences } = req.body;
    const studyNoteId = req.params.id;

    let queryValuesHolder = "";
    let queryValues: Array<number> = [];

    for (let i = 0; i < sentences.length; i++) {
      queryValuesHolder += `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${
        i * 4 + 4
      })`;
      queryValues.push(sentences[i].id);
      queryValues.push(sentences[i].text);
      queryValues.push(sentences[i].type);
      queryValues.push(Number(sentences[i].studyNoteId));

      if (i < sentences.length - 1) {
        queryValuesHolder += `,`;
      }
    }

    try {
      const client = await pool.connect();
      await client.query(
        `
        DELETE FROM sentences
        WHERE sentences.study_note_id = $1::integer
        `,
        [studyNoteId]
      );

      await client.query(
        `
        INSERT INTO sentences (id, text, type, study_note_id)
        VALUES ${queryValuesHolder}
        `,
        queryValues
      );

      res.status(201).json({ body: [] });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  })
  .get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
      const client = await pool.connect();
      const results = await client.query(
        `
        SELECT * from sentences WHERE sentences.study_note_id = $1
        `,
        [id]
      );

      res.status(200).json({ body: results.rows });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] });
    }
  });

module.exports = router;
