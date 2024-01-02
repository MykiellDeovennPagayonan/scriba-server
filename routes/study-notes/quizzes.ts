import express from "express";
const router = express.Router();
import { Response, Request } from "express";
import { client } from "../../server";
import requireAuth from "../../middleware/authMiddleware";

router
  .post("/:id", async (req: Request, res: Response) => {
    const { quizItems } = req.body;

    const studyNoteId = req.params.id;

    let queryValuesHolder = "";
    let queryValues: Array<number> = [];

    for (let i = 0; i < quizItems.length; i++) {
      queryValuesHolder += `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`;
      queryValues.push(quizItems[i].question);
      queryValues.push(quizItems[i].answer);
      queryValues.push(Number(studyNoteId));

      if (i < quizItems.length - 1) {
        queryValuesHolder += `,`;
      }
    }

    console.log(queryValues);
    console.log(queryValuesHolder);

    await client.query(
      `
  DELETE FROM quiz_questions
  WHERE quiz_questions.study_notes_id = $1::integer
  `,
      [studyNoteId]
    );

    await client.query(
      `
  INSERT INTO quiz_questions (question, answer, study_notes_id)
  VALUES ${queryValuesHolder}
  `,
      queryValues
    );

    res.json({ authenticated: true, body: quizItems });
  })
  .get("/:id", requireAuth, async (req: Request, res: Response) => {
    const id = req.params.id;

    const results = await client.query(
      `
      SELECT * FROM quiz_questions WHERE quiz_questions.study_notes_id = $1
      `,
      [id]
    );

    console.log(results)

    res.json({ authenticated: true, body: results.rows });
  });

module.exports = router;
