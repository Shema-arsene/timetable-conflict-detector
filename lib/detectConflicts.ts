import { TimetableEntry, Conflict } from "../types/timetable"

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number)
  return h * 60 + m
}

function doTimesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean {
  const s1 = timeToMinutes(start1)
  const e1 = timeToMinutes(end1)
  const s2 = timeToMinutes(start2)
  const e2 = timeToMinutes(end2)

  return Math.max(s1, s2) < Math.min(e1, e2)
}

export function detectConflicts(entries: TimetableEntry[]): Conflict[] {
  const conflicts: Conflict[] = []

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i]
      const b = entries[j]

      // Only check if same campus (different campuses don't conflict)
      if (a.campus !== b.campus) continue

      // Check if times overlap
      if (!doTimesOverlap(a.startTime, a.endTime, b.startTime, b.endTime))
        continue

      // Room conflict
      if (a.roomId === b.roomId) {
        conflicts.push({
          type: "room",
          entry1: a,
          entry2: b,
          message: `Room conflict: Same room used at overlapping time`,
        })
      }

      // Lecturer conflict
      if (a.lecturerId === b.lecturerId) {
        conflicts.push({
          type: "lecturer",
          entry1: a,
          entry2: b,
          message: `Lecturer conflict: Same lecturer assigned to overlapping sessions`,
        })
      }
    }
  }

  return conflicts
}
