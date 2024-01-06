import express from "express";
const router = express.Router();
import { Response, Request } from "express";
import { pool } from "../../server";
import requireAuth from "../../middleware/authMiddleware";

router
  .post("/:id", requireAuth, async (req: Request, res: Response) => {
    const { deleteSentences, addSentences, editSentences } = req.body;
    const studyNoteId = req.params.id;

    let queryValuesHolderDelete = "(";
    let queryValuesDelete: Array<number> = [];

    for (let i = 0; i < deleteSentences.length; i++) {
      queryValuesHolderDelete += `$${i + 1}`;
      queryValuesDelete.push(deleteSentences[i].id)

      if (i < deleteSentences.length - 1) {
        queryValuesHolderDelete += `,`;
      } else {
        queryValuesHolderDelete += `)`
      }
    }

    let queryValuesHolderAdd = "";
    let queryValuesAdd: Array<number> = [];

    for (let i = 0; i < addSentences.length; i++) {
      queryValuesHolderAdd += `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`;
      queryValuesAdd.push(addSentences[i].id);
      queryValuesAdd.push(addSentences[i].text);
      queryValuesAdd.push(addSentences[i].type);
      queryValuesAdd.push(Number(addSentences[i].studyNoteId));

      if (i < addSentences.length - 1) {
        queryValuesHolderAdd += `,`;
      }
    }

    let queryValuesHolderEdit = "";
    let queryValuesEdit: Array<number> = [];

    for (let i = 0; i < editSentences.length; i++) {
      queryValuesHolderEdit += `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`;
      queryValuesEdit.push(editSentences[i].id);
      queryValuesEdit.push(editSentences[i].text);
      queryValuesEdit.push(editSentences[i].type);

      if (i < editSentences.length - 1) {
        queryValuesHolderEdit += `,`;
      } 
    }

    console.log(queryValuesHolderAdd)
    console.log(queryValuesAdd)

    try {
      const client = await pool.connect();

      if (queryValuesDelete.length > 0) {
        await client.query(
          `
          DELETE FROM sentences
          WHERE id IN ${queryValuesHolderDelete}
          `,
          queryValuesDelete
        )
      }

      if (queryValuesAdd.length > 0) {
        await client.query(
          `
          INSERT INTO sentences (id, text, type, study_note_id)
          VALUES ${queryValuesHolderAdd}
          `,
          queryValuesAdd
        );
      }

      if (queryValuesEdit.length > 0) {
        await client.query(
          `
          UPDATE sentences
          SET
            text = new_sentences.text,
            type = new_sentences.type
          FROM (
            VALUES
              ${queryValuesHolderEdit}
            ) AS new_sentences(id, text, type)
            WHERE sentences.id = new_sentences.id;
  
          `,
          queryValuesEdit
        );
      }

      await client.query(
        `
          UPDATE study_notes 
          SET study_notes_edited_date = NOW()
          WHERE id = $1
        `, [studyNoteId]
      )

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
