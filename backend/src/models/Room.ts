import mongoose, { Schema, Document } from "mongoose"

export interface IRoom extends Document {
  name: string
  campus: string
  capacity?: number
  createdAt: Date
  updatedAt: Date
}

const RoomSchema = new Schema<IRoom>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    campus: {
      type: String,
      required: true,
      trim: true,
    },
    capacity: {
      type: Number,
      min: 1,
    },
  },
  {
    timestamps: true,
  },
)

// Prevent duplicate rooms on same campus
RoomSchema.index({ name: 1, campus: 1 }, { unique: true })

export default mongoose.model<IRoom>("Room", RoomSchema)
