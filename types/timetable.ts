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
  type: "room" | "lecturer" | "module"
  entry1: TimetableEntry
  entry2: TimetableEntry
  message: string
}
