import { Types } from "mongoose"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string | Types.ObjectId
        // I can add other user properties as needed
        email?: string
        isVerified?: boolean
      }
    }
  }
}
