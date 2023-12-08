import jwt from "jsonwebtoken"

export function authenticateToken(token : string) {

  jwt.verify(token, process.env.JWT_SECRET as string, (error, user) => {
    if (error) {
      console.log(error)
      return false
    }

    return user
  })
}