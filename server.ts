import express from "express";
import generateAccessToken from "./utils/generateAccessToken";
import cors from "cors"
import { Client } from "pg"
import * as dotenv from "dotenv";
import { compare } from "bcrypt";

dotenv.config({ path: "/.env" });

const app = express();

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function startServer() {


  app
    .use(cors())
    .use(express.json())
    .get("/api/burgers", (req, res) => {
      res.json({ burger: "delicious" });
    })
    .post("/api/auth/login",  async (request, response) => {
      try {
        const { email, password } = await request.json();
        console.log(password)
    
        const response = await client.query(`
        SELECT * FROM users WHERE email = ${email}
        `)
        
        const user = response.rows[0];
    
        if (response.rows.length === 0) {
          response.json({ message: "email or password is incorrect"})
        }
    
        const correctPassword = await compare(password, user.password);
    
        if (!correctPassword) {
          response.json({ message: "email or password is incorrect"})
        }
    
        const token = generateAccessToken({ email, password, })
    
        console.log(token);
        return response.json({ token: token });
      } catch (error) {
        console.log("Error:", error);
        return response.json({ message: "failure", error: error });
      }
    })
    .listen(3001, () => {
      console.log("Server has started at http://localhost:3001");
    });
}

startServer();