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

    const client = await pool.connect()
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

    res.json({ authenticated: true, body: "Blehhh" });
    client.release()
  })
  .get("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;

    const client = await pool.connect()
    const results = await client.query(
      `
      SELECT * from sentences WHERE sentences.study_note_id = $1
      `,
      [id]
    );

    res.json({ authenticated: true, body: results.rows });
    client.release()
  });

module.exports = router;