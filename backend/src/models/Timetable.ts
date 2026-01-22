// import mongoose, { Document, Schema } from "mongoose"

// export type SessionType =
//   | "weekday_morning"
//   | "weekday_afternoon"
//   | "evening"
//   | "weekend_morning"
//   | "weekend_afternoon"

// export interface ITimetableEntry {
//   campus: string
//   module: Schema.Types.ObjectId
//   startTime: string
//   endTime: string
//   room: Schema.Types.ObjectId
//   lecturer: Schema.Types.ObjectId
//   session: SessionType

//   day: string
//   location: string
// }

// export interface ITimetableSlot {
//   module: Schema.Types.ObjectId
//   room: Schema.Types.ObjectId
//   lecturer: Schema.Types.ObjectId
//   className: string
//   session: SessionType
//   day: string
// }

// export interface ITimetable extends Document {
//   slots: ITimetableSlot[]
//   createdBy: Schema.Types.ObjectId
// }

// export interface Timetable {
//   [key: string]: ITimetableEntry[]
// }

// const TimetableSlot = new Schema({
//   module: {
//     type: Schema.Types.ObjectId,
//     ref: "Module",
//   },
//   room: {
//     type: Schema.Types.ObjectId,
//     ref: "Room",
//   },
//   lecturer: {
//     type: Schema.Types.ObjectId,
//     ref: "Lecturer",
//   },
//   className: {
//     required: true,
//     type: String,
//   },
//   session: {
//     required: true,
//     type: String,
//   },
//   day: {
//     required: true,
//     type: String,
//   },
// })

// const TimetableSchema = new Schema<ITimetable>({
//   slots: [TimetableSlot],
//   createdBy: { type: Schema.Types.ObjectId, ref: "User" },
// })

// export default mongoose.model<ITimetable>("Timetable", TimetableSchema)

import mongoose, { Schema, Document } from "mongoose"

export type SessionType = "day" | "evening" | "weekend"

interface ModuleSlot {
  module: Schema.Types.ObjectId
  lecturer: Schema.Types.ObjectId
  room: Schema.Types.ObjectId
  campus: "Kacyiru" | "Remera"
  startTime: string
  endTime: string
}

interface SchoolGroup {
  schoolName: string
  modules: ModuleSlot[]
}

export interface ITimetable extends Document {
  session: SessionType
  startDate: string
  endDate: string
  schools: SchoolGroup[]
  createdAt: Date
}

const ModuleSlotSchema = new Schema<ModuleSlot>(
  {
    module: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    lecturer: { type: Schema.Types.ObjectId, ref: "Lecturer", required: true },
    room: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    campus: {
      type: String,
      enum: ["Kacyiru", "Remera"],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false },
)

const SchoolGroupSchema = new Schema<SchoolGroup>(
  {
    schoolName: { type: String, required: true },
    modules: { type: [ModuleSlotSchema], required: true },
  },
  { _id: false },
)

const TimetableSchema = new Schema<ITimetable>(
  {
    session: {
      type: String,
      enum: ["day", "evening", "weekend"],
      required: true,
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    schools: { type: [SchoolGroupSchema], required: true },
  },
  { timestamps: true },
)

export default mongoose.model<ITimetable>("Timetable", TimetableSchema)
