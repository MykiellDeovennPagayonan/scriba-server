import jwt from "jsonwebtoken"

export default function generateAccessToken(user) {
  const token = jwt.sign(user, process.env.JWT_ACCESS_SECRET)

  return token
}