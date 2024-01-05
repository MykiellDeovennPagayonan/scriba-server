import express from "express";
const router = express.Router();
import { Response, Request, NextFunction } from "express";
import { pool } from "../server";
import { compare, hash } from "bcrypt";
import generateAccessToken from "../utils/generateAccessToken";

router
  .post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const client = await pool.connect();
      const response = await client.query(`
        SELECT * FROM users WHERE email = $1
        `, [email]
      )

      const user = response.rows[0];

      if (response.rows.length === 0 || !user) {
        res.status(401).json({ message: "email or password is incorrect" });
        client.release()
        return
      }

      const userId = user.id;

      const isPasswordCorrect = await compare(password, user.password);

      if (!isPasswordCorrect) {
        res.status(401).json({ message: "email or password is incorrect" });
        client.release();
        return
      }

      const token = generateAccessToken({ email, id: userId });

      res.status(200).json({ body: { token: token } });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error, body: [] })
    }
  })
  .post("/register", async (req: Request, res: Response) => {
    const { userName, email, password } = req.body;
    try {
      const hashedPassword = await hash(password, 10);
      const client = await pool.connect();

      const response = await client.query(`
        INSERT INTO users (username, email, password)
        VALUES ($1, $2, $3)
        RETURNING id
        `, [userName, email, hashedPassword]
      );

      const userId = response.rows[0].id;

      const token = generateAccessToken({ email, id: userId });
      res.status(201).json({ body : {token: token} });
      client.release();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "failed to register", error: error });
    }
  });

module.exports = router;
