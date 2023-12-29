import express from "express";
import cors from "cors";
import { Client } from "pg";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const app = express();
const studyGroupRouter = require("./routes/studyGroups");
const studyNotesRouter = require("./routes/studyNotes")
const authRouther = require("./routes/auth")

const connectionString = process.env.DATABASE_URL

export const client = new Client({
  connectionString: connectionString,
});

async function startServer() {
  await client.connect();

  app
    .use(cors())
    .use(express.json())
    .use("/api/auth", authRouther)
    .use("/studygroup", studyGroupRouter)
    .use("/api/study-notes", studyNotesRouter)
    .listen(3001, () => {
      console.log("Server has started at http://localhost:3001");
    });
}

startServer();
