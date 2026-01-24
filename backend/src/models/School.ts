import mongoose, { Schema, Document } from "mongoose"

export interface ISchool extends Document {
  name: string
  campus: "Kacyiru" | "Remera"
  description?: string
  createdAt: Date
  updatedAt: Date
}

const SchoolSchema = new Schema<ISchool>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    campus: {
      type: String,
      required: true,
      enum: ["Kacyiru", "Remera"],
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model<ISchool>("School", SchoolSchema)
