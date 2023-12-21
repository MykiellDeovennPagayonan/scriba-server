import { NextFunction, Response, Request } from "express";
import { authenticateToken } from "../utils/authenticateToken";

export default async function requireAuth(req: Request, res: Response, next: NextFunction) {
  console.log("hello")
  next()
  // const token = req.headers.authorization?.split(' ')[1] || null;

  // if (!token) {
  //   res.redirect("/login")
  // } 

  // try {
  //   const isValid: boolean = await authenticateToken(token || "");

  //   if (isValid) {
  //     return next();
  //   } else {
  //     return res.redirect("/login");
  //   }
  // } catch (error) {
  //   console.error('Error verifying token:', error);
  //   return res.redirect("/login");
  // }
}