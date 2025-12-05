import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

export interface AuthRequest extends Request {
  user?: {
    id: string | mongoose.Types.ObjectId
    email: string
  }
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      throw new Error()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    }

    next()
  } catch (error) {
    res.status(401).json({ message: "Please login!" })
  }
}
