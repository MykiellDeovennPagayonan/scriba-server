import { NextFunction, Response, Request } from "express";
import { authenticateToken } from "../utils/authenticateToken";

export default async function requireAuth(req: Request, res: Response, next: NextFunction) {
  let token = req.headers.authorization?.split(' ')[1] || null;

  if (token === "null") {
    token = null
  }

  console.log(token)

  if (token === null) {
    console.log("here")
    res.json({ authenticated: false, body: []})
  } else {
    next()
  }


  // try {
  //   const isValid: boolean = await authenticateToken(token || "");

  //   if (isValid) {
  //     console.log("goods!")
  //     next();
  //   } else {
  //     res.redirect("/login");
  //   }
  // } catch (error) {
  //   console.error('Error verifying token:', error);
  //   res.redirect("/login");
  // }
}