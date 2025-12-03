import mongoose, { Document, Schema } from "mongoose"

export interface IUser extends Document {
  email: string
  password: string // hashed
  role: "admin" | "lecturer" | "student"
  isVerified: boolean
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin"],
    default: "admin",
  },
  // isVerified: { type: Boolean, default: false },
})

export default mongoose.model<IUser>("User", UserSchema)
