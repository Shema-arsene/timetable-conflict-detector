import { ITimetableSlot } from "../models/Timetable"

// Conflict rules:
// 1) Two modules scheduled in the same room for the same session + day
// 2) A lecturer assigned to two different classes in the same session + day

export function detectConflicts(slots: any[]) {
  const errors: string[] = []

  // index by room+session+day
  const roomIndex = new Map()
  const lecturerIndex = new Map()

  for (const s of slots) {
    const keyRoom = `${s.room}-${s.session}-${s.day}`
    if (roomIndex.has(keyRoom)) {
      errors.push(
        `Room conflict: ${s.room} has multiple modules in ${s.session} on ${s.day}`
      )
    } else {
      roomIndex.set(keyRoom, s)
    }

    const keyLect = `${s.lecturer}-${s.session}-${s.day}`
    if (lecturerIndex.has(keyLect)) {
      const prev = lecturerIndex.get(keyLect)
      if (prev.className !== s.className) {
        errors.push(
          `Lecturer conflict: ${s.lecturer} assigned to multiple classes in ${s.session} on ${s.day}`
        )
      }
    } else {
      lecturerIndex.set(keyLect, s)
    }
  }

  return errors
}
