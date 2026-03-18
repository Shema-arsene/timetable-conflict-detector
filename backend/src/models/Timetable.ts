// import mongoose, { Schema, Document } from "mongoose"

// export type SessionType = "day" | "evening" | "weekend"

// interface ModuleSlot {
//   module: Schema.Types.ObjectId
//   lecturerId: Schema.Types.ObjectId
//   roomId: Schema.Types.ObjectId
//   campus: "Kacyiru" | "Remera"
//   startTime: string
//   endTime: string
// }

// interface SchoolGroup {
//   schoolId: Schema.Types.ObjectId
//   modules: ModuleSlot[]
// }

// export interface ITimetable extends Document {
//   heading: string
//   session: SessionType
//   startDate: string
//   endDate: string
//   schools: SchoolGroup[]
//   createdAt: Date
// }

// const ModuleSlotSchema = new Schema<ModuleSlot>(
//   {
//     module: {
//       type: Schema.Types.ObjectId,
//       ref: "Module",
//       required: true,
//     },
//     lecturerId: {
//       type: Schema.Types.ObjectId,
//       ref: "Lecturer",
//       required: true,
//     },
//     roomId: {
//       type: Schema.Types.ObjectId,
//       ref: "Room",
//       required: true,
//     },
//     campus: {
//       type: String,
//       enum: ["Kacyiru", "Remera"],
//       required: true,
//     },
//     startTime: {
//       type: String,
//       required: true,
//     },
//     endTime: {
//       type: String,
//       required: true,
//     },
//   },
//   { _id: false },
// )

// const SchoolGroupSchema = new Schema<SchoolGroup>(
//   {
//     schoolId: {
//       type: Schema.Types.ObjectId,
//       ref: "School",
//       required: true,
//     },
//     modules: {
//       type: [ModuleSlotSchema],
//       required: true,
//     },
//   },
//   { _id: false },
// )

// const TimetableSchema = new Schema<ITimetable>(
//   {
//     heading: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     session: {
//       type: String,
//       enum: [
//         "weekday_morning",
//         "weekday_afternoon",
//         "weekday_evening",
//         "weekend",
//       ],
//       required: true,
//     },
//     startDate: { type: String, required: true },
//     endDate: { type: String, required: true },
//     schools: { type: [SchoolGroupSchema], required: true },
//   },
//   { timestamps: true },
// )

// export default mongoose.model<ITimetable>("Timetable", TimetableSchema)

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
