import mongoose, { Document, Schema } from "mongoose"

export type SessionType =
  | "weekday_morning"
  | "weekday_afternoon"
  | "evening"
  | "weekend_morning"
  | "weekend_afternoon"

export interface ITimetableSlot {
  module: Schema.Types.ObjectId
  room: Schema.Types.ObjectId
  lecturer: Schema.Types.ObjectId
  className: string // e.g. "Year2-CS"
  session: SessionType
  day: string // optional: Mon, Tue...
}

export interface ITimetable extends Document {
  slots: ITimetableSlot[]
  createdBy: Schema.Types.ObjectId
}

const TimetableSlot = new Schema({
  module: {
    type: Schema.Types.ObjectId,
    ref: "Module",
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
  lecturer: {
    type: Schema.Types.ObjectId,
    ref: "Lecturer",
  },
  className: String,
  session: String,
  day: String,
})

const TimetableSchema = new Schema<ITimetable>({
  slots: [TimetableSlot],
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
})

export default mongoose.model<ITimetable>("Timetable", TimetableSchema)
