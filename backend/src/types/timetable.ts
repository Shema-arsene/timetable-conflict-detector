// export interface TimetableSlot {
//   moduleId: string
//   lecturerId: string
//   roomId: string
//   schoolId: string
//   campusId: string
//   // day: string
//   startTime: string
//   endTime: string
// }

// export type ConflictType = "room" | "lecturer" | "class"

// export interface Conflict {
//   type: ConflictType
//   slotA: TimetableSlot
//   slotB: TimetableSlot
// }

// backend/src/types/timetable.ts (and frontend/types/timetable.ts)
export interface TimetableEntry {
  schoolId: string
  moduleId: string
  lecturerId: string
  roomId: string
  campus: "Kacyiru" | "Remera"
  startTime: string
  endTime: string
}

export interface CreateTimetablePayload {
  title: string
  session: "day" | "evening" | "weekend"
  startDate: string
  endDate: string
  entries: TimetableEntry[]
}

export interface Conflict {
  type: "room" | "lecturer"
  entry1: TimetableEntry
  entry2: TimetableEntry
  message: string
}
