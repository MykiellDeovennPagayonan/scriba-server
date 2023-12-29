import express from "express";
const router = express.Router();
import { Response, Request, NextFunction } from "express";
import { client } from "../server";
import { compare, hash } from "bcrypt";
import generateAccessToken from "../utils/generateAccessToken";

// router.all('/api/*', requireAuthentication)

router
  .post("/login", async (req: Request, res: Response) => {
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
  .post("/register", async (req: Request, res: Response) => {
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

module.exports = router;