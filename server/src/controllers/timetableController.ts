import { Request, Response } from "express"
import Timetable from "../models/Timetable"
import { detectConflicts } from "../utils/conflictDetector"

export async function createTimetable(req: Request, res: Response) {
  const { slots } = req.body // validate shape
  const conflicts = detectConflicts(slots)
  if (conflicts.length) return res.status(400).json({ conflicts })

  const tt = await Timetable.create({ slots, createdBy: req.user.id })
  res.status(201).json(tt)
}
