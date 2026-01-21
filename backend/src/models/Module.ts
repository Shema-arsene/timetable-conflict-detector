import mongoose, { Schema, Document } from "mongoose"

export interface IModule extends Document {
  name: string
  code: string
  campus: string
  createdAt: Date
  updatedAt: Date
}

const ModuleSchema = new Schema<IModule>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    campus: {
      type: String,
      required: true,
      enum: ["Kacyiru", "Remera"],
    },
  },
  { timestamps: true },
)

export default mongoose.model<IModule>("Module", ModuleSchema)
