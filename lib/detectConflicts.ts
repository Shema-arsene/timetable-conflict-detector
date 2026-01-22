// Conflict Detection Logic

// import { SessionType } from "../backend/src/models/sessionType.js"

export interface TimetableSlot {
  module: string
  room: string
  lecturer: string
  className: string
  day: string
  startTime: string
  endTime: string
  // session: SessionType
}

interface Conflict {
  type: "room" | "lecturer" | "class"
  slotA: TimetableSlot
  slotB: TimetableSlot
}

const toMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

const overlaps = (
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean => {
  return (
    toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd)
  )
}

export const detectConflicts = (slots: TimetableSlot[]): Conflict[] => {
  const conflicts: Conflict[] = []

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i]
      const b = slots[j]

      if (a.day !== b.day) continue
      // if (a.session !== b.session) continue
      if (!overlaps(a.startTime, a.endTime, b.startTime, b.endTime)) continue

      if (a.room === b.room) {
        conflicts.push({ type: "room", slotA: a, slotB: b })
      }

      if (a.lecturer === b.lecturer) {
        conflicts.push({ type: "lecturer", slotA: a, slotB: b })
      }

      if (a.className === b.className) {
        conflicts.push({ type: "class", slotA: a, slotB: b })
      }
    }
  }

  return conflicts
}
