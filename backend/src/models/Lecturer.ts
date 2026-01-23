import mongoose, { Schema, Document } from "mongoose"

export interface ILecturer extends Document {
  firstName: string
  lastName: string
  email: string
  phone?: string
  campus: string
  createdAt: Date
  updatedAt: Date
}

const LecturerSchema = new Schema<ILecturer>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model<ILecturer>("Lecturer", LecturerSchema)
