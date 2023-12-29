import express from "express";
import generateAccessToken from "./utils/generateAccessToken";
import cors from "cors";
import { Request, Response } from "express";
import { Client } from "pg";
import * as dotenv from "dotenv";
import { compare, hash } from "bcrypt";
import requireAuth from "./middleware/authMiddleware";

dotenv.config({ path: ".env" });

interface Topic {
  name: string,
  id: number
}

interface CreateStudyNoteRequest {
  title: string;
  topics: Array<Topic>;
  isPublic: boolean;
}

const app = express();
const studyGroupRouter = require("./routes/studyGroups");

const connectionString = process.env.DATABASE_URL

export const client = new Client({
  connectionString: connectionString,
});

async function startServer() {
  await client.connect();

  app
    .use(cors())
    .use(express.json())
    .get("/api/study-notes", requireAuth,  async (req: Request, res: Response) => {
      const result = await client.query(`
      SELECT topics.name, topics.id from topics
      `);
      res.json({ authenticated: true, body: result.rows });
    })
    .post("/api/study-notes", async (req: Request, res: Response) => {
      const { title, topics, isPublic } : CreateStudyNoteRequest = req.body

      try {
        const id = await client.query(
          `
          INSERT INTO study_notes (date_published, title, is_public, study_notes_edited_date)
          VALUES (NOW(), $1, $2, NOW())
          RETURNING id
          `,
          [title, isPublic]
        );

        const studyNoteID = id.rows[0].id

        let queryValuesHolder = ""
        let queryValues : Array<number> = []

        for (let i = 0; i < topics.length; i++) {
          queryValuesHolder += `($${i * 2 + 1}, $${i * 2 + 2})`
          queryValues.push(topics[i].id)
          queryValues.push(studyNoteID)

          if (i < topics.length - 1) {
            queryValuesHolder += `,`
          }
        }

        console.log(queryValuesHolder)
        console.log(queryValues)

        const response = await client.query(
          `
          INSERT INTO study_note_topics (topic_id, study_notes_id)
          VALUES ${queryValuesHolder}
          RETURNING id
          `,
          queryValues
        )

        console.log(response)

        return res.json({ message: studyNoteID });
      } catch (error) {
        console.log("Error:", error);
      }

      res.json({ authenticated: true, body: "hello" })
    })
    .post("/api/auth/login", async (req: Request, res: Response) => {
      const { email, password } = req.body;

      try {
        const response = await client.query(
          `
        SELECT * FROM users WHERE email = $1
        `,
          [email]
        );

        const user = response.rows[0];

        if (response.rows.length === 0) {
          res.json({ message: "email or password is incorrect" });
        }

        const correctPassword = await compare(password, user.password);

        if (!correctPassword) {
          return res.json({ message: "email or password is incorrect" });
        }

        const token = generateAccessToken(email);

        console.log(token + " loginned");
        return res.json({ token: token });
      } catch (error) {
        console.log("Error:", error);
      }
    })
    .post("/api/auth/register", async (req: Request, res: Response) => {
      const { userName, email, password } = req.body;

      console.log(req.body);
      try {
        const hashedPassword = await hash(password, 10);

        console.log(hashedPassword);
        console.log("ok ok ok");

        const response = await client.query(
          `
          INSERT INTO users (username, email, password)
          VALUES ($1, $2, $3)
          `,
          [userName, email, hashedPassword]
        );

        console.log(response);


        const token = generateAccessToken(email);
        res.json({ token: token });
      } catch (error) {
        console.log("Error:", error);
        res.json({ message: "failure", error: error });
      }
    });

  app
    .use("/studygroup", studyGroupRouter)

    .listen(3001, () => {
      console.log("Server has started at http://localhost:3001");
    });
}

startServer();
