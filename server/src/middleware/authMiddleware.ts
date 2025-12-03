import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export function requireAuth(req: any, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header) return res.status(401).json({ message: "Unauthorized" })
  const token = header.split(" ")[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string)
    req.user = payload
    next()
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }
}
