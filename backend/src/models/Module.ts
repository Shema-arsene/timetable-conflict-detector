import mongoose, { Schema, Document, Types } from "mongoose"

export interface IModule extends Document {
  name: string
  code: string
  campus: "Kacyiru" | "Remera"
  school: Types.ObjectId
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
    school: {
      type: Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
  },
  { timestamps: true },
)

export default mongoose.model<IModule>("Module", ModuleSchema)
