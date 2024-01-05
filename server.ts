import express from "express";
import cors from "cors";
import { Pool } from 'pg';
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const app = express();
const studyGroupRouter = require("./routes/studyGroups");
const studyNotesRouter = require("./routes/studyNotes")
const authRouther = require("./routes/auth")
const topics = require("./routes/topics")

const connectionString = process.env.DATABASE_URL

export const pool = new Pool({
  connectionString: connectionString,
});

async function startServer() {

  app
    .use(cors())
    .use(express.json())
    .use("/api/topics", topics)
    .use("/api/auth", authRouther)
    .use("/api/study-groups", studyGroupRouter)
    .use("/api/study-notes", studyNotesRouter)
    .get("/test", async (req, res) => {
      res.json({ message: "success" })
    })
    .listen(8080, () => {
      console.log("Server has started at http://localhost:3001");
    });
}

startServer();
