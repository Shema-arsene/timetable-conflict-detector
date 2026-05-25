import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1]
  const jwtSecret = process.env.JWT_SECRET

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." })
  }

  try {
    const decoded = jwt.verify(token, jwtSecret as string) as {
      id: string
      email: string
      role: string
    }
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." })
  }
}

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required." })
  }
  next()
}
