// export interface TimetableSlot {
//   moduleId: string
//   lecturerId: string
//   roomId: string
//   schoolId: string // schoolId or class identifier
//   campusId: string
//   day: string // "Monday", "Tuesday", etc
//   startTime: string // "HH:mm"
//   endTime: string // "HH:mm"
// }

// export type ConflictType = "room" | "lecturer" | "class"

// export interface Conflict {
//   type: ConflictType
//   slotA: TimetableSlot
//   slotB: TimetableSlot
// }

// frontend/types/timetable.ts
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

// Optional response types for API
// export interface TimetableResponse {
//   success: boolean
//   message: string
//   timetable?: any // or create a more specific type
//   conflicts?: Conflict[]
// }
