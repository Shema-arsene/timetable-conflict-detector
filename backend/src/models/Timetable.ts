import mongoose, { Schema, Document } from "mongoose"

export type SessionType = "day" | "evening" | "weekend"

// Structure: one entry per row in the timetable
export interface ITimetableEntry {
  schoolId: mongoose.Types.ObjectId
  moduleId: mongoose.Types.ObjectId
  lecturerId: mongoose.Types.ObjectId
  roomId: mongoose.Types.ObjectId
  campus: "Kacyiru" | "Remera"
  startTime: string // ex: "08:30"
  endTime: string // ex: "12:00"
}

export interface ITimetable extends Document {
  title: string
  session: SessionType
  startDate: string
  endDate: string
  entries: ITimetableEntry[]
  createdAt: Date
  updatedAt: Date
}

const TimetableEntrySchema = new Schema<ITimetableEntry>(
  {
    schoolId: { type: Schema.Types.ObjectId, ref: "School", required: true },
    moduleId: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    lecturerId: {
      type: Schema.Types.ObjectId,
      ref: "Lecturer",
      required: true,
    },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    campus: { type: String, enum: ["Kacyiru", "Remera"], required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false },
)

const TimetableSchema = new Schema<ITimetable>(
  {
    title: { type: String, required: true },
    session: {
      type: String,
      enum: ["day", "evening", "weekend"],
      required: true,
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    entries: [TimetableEntrySchema],
  },
  { timestamps: true },
)

export default mongoose.model<ITimetable>("Timetable", TimetableSchema)
