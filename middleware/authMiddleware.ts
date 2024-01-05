import { NextFunction, Response, Request } from "express";
import { authenticateToken } from "../utils/authenticateToken";

export default async function requireAuth(req: Request, res: Response, next: NextFunction) {
  let token = req.headers.authorization?.split(' ')[1] || null;

  if (token === null || token === "null") {
    return res.status(401).json({ body: [] })
  } else {
    const isValid: boolean = await authenticateToken(token);
    console.log(isValid)

    if (!isValid) {
      return res.status(401).json({ body: [] })
    } 

    next()
  }
}