import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  firstName: string
  secondName: string
  email: string
  password: string
  role: "admin" | "user" | "dean"
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    secondName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user", "dean"],
      default: "user",
    },
  },
  { timestamps: true },
)

export default mongoose.model<IUser>("User", UserSchema)
