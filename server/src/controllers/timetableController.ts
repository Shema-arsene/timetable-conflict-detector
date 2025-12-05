import { Request, Response } from "express"
import Timetable from "../models/Timetable"
import { detectConflicts } from "../utils/conflictDetector"

interface AuthenticatedRequest extends Request {
  user: {
    id: string
  }
}

export const createTimetable = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { slots } = req.body

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  // For conflict detection, use string IDs
  const slotsForConflictDetection = slots.map((slot: any) => ({
    ...slot,
    module: slot.module,
    room: slot.room,
    lecturer: slot.lecturer,
  }))

  const conflicts = detectConflicts(slotsForConflictDetection)
  if (conflicts.length) return res.status(400).json({ conflicts })

  try {
    // Create a new Timetable instance
    const timetable = new Timetable({
      slots: slots,
      createdBy: req.user.id,
    })

    // Saving it to the database
    const tt = await timetable.save()

    res.status(201).json(tt)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}
