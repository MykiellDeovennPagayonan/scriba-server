import express from "express";
const router = express.Router();
import { Response, Request } from "express";
import { pool } from "../../server";
import requireAuth from "../../middleware/authMiddleware";

router
  .delete("/delete", async (req: Request, res: Response) => {
    const { id: quizItemId } = req.body;
    const client = await pool.connect();

    console.log(quizItemId);

    const result = await client.query(
      `
      DELETE FROM quiz_questions
      WHERE id = $1
      `,
      [quizItemId]
    );

    res.json({ authenticated: true, body: result.rows });
    client.release();
  })
  .post("/:id", async (req: Request, res: Response) => {
    const { question, answer, studyNoteId } = req.body;

    const client = await pool.connect();
    const response = await client.query(
      `
    INSERT INTO quiz_questions (question, answer, study_notes_id)
    VALUES ($1, $2, $3)
    RETURNING id
  `,
      [question, answer, studyNoteId]
    );

    res.json({ authenticated: true, body: { id: response.rows[0].id } });
    client.release();
  })
  .get("/:id", requireAuth, async (req: Request, res: Response) => {
    const id = req.params.id;

    const client = await pool.connect();
    const results = await client.query(
      `
      SELECT * FROM quiz_questions WHERE quiz_questions.study_notes_id = $1
      `,
      [id]
    );

    res.json({ authenticated: true, body: results.rows });
    client.release();
  })
  .put("/:id", async (req: Request, res: Response) => {
    const { id, question, answer } = req.body;
    const studyNoteId = req.params.id;

    const client = await pool.connect();
    const response = await client.query(
      `
      UPDATE quiz_questions
      SET
        question = $1,
        answer = $2
      WHERE id = $3
      RETURNING id
    `,
      [question, answer, id]
    );

    const quizQuestionId = response.rows[0].id;

    res.json({ authenticated: true, body: quizQuestionId });
    client.release();
  });

module.exports = router;
