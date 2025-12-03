import mongoose, { Document, Schema } from "mongoose"

export interface IRoom extends Document {
  name: string
  capacity: number
}

const RoomSchema = new Schema<IRoom>({
  name: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
    default: 0,
  },
})

export default mongoose.model<IRoom>("Room", RoomSchema)
