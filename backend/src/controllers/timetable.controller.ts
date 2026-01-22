import { Request, Response } from "express"
import Timetable from "../models/Timetable.js"
// import { detectTimetableConflicts } from "../utils/detectConflicts"

export const createTimetable = async (req: Request, res: Response) => {
  try {
    const { session, startDate, endDate, schools } = req.body

    if (!session || !startDate || !endDate || !schools) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // const conflicts = detectTimetableConflicts(schools)

    // if (conflicts.length > 0) {
    //   return res.status(409).json({
    //     message: "Timetable conflicts detected",
    //     conflicts,
    //   })
    // }

    const timetable = await Timetable.create({
      session,
      startDate,
      endDate,
      schools,
    })

    res.status(201).json(timetable)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to create timetable" })
  }
}
