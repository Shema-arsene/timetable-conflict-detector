import { Request, Response } from "express"
import Lecturer from "../models/Lecturer.js"
import Timetable from "../models/Timetable.js"

// GET /api/lecturers
export const getLecturers = async (_req: Request, res: Response) => {
  const lecturers = await Lecturer.find().sort({ createdAt: -1 })
  res.json(lecturers)
}

// GET /api/lecturers/:id
export const getLecturerById = async (req: Request, res: Response) => {
  const lecturer = await Lecturer.findById(req.params.id)
  if (!lecturer) {
    return res.status(404).json({ message: "Lecturer not found" })
  }
  res.json(lecturer)
}

// POST /api/lecturers
export const createLecturer = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone } = req.body

  if (!firstName || !lastName || !email) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled" })
  }

  const exists = await Lecturer.findOne({ email })
  if (exists) {
    return res.status(409).json({ message: "Lecturer email already exists" })
  }

  const lecturer = await Lecturer.create({
    firstName,
    lastName,
    email,
    phone,
  })
  res.status(201).json(lecturer)
}

// PUT /api/lecturers/:id
export const updateLecturer = async (req: Request, res: Response) => {
  const lecturer = await Lecturer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })
  if (!lecturer) {
    return res.status(404).json({ message: "Lecturer not found" })
  }
  res.json(lecturer)
}

// DELETE /api/lecturers/:id
export const deleteLecturer = async (req: Request, res: Response) => {
  try {
    const lecturerId = req.params.id

    // Check if lecturer exists
    const lecturer = await Lecturer.findById(lecturerId)
    if (!lecturer) {
      return res.status(404).json({ message: "Lecturer not found" })
    }

    // Get today's date
    const today = new Date().toISOString().split("T")[0]

    // Find all timetables where this lecturer appears
    const timetablesWithLecturer = await Timetable.find({
      "entries.lecturerId": lecturerId,
    }).populate("entries.moduleId", "name code")

    // Filter to find future sessions
    const futureSessions = []

    for (const timetable of timetablesWithLecturer) {
      // Check if timetable end date is in the future
      if (timetable.endDate >= today) {
        // Find specific entries for this lecturer in this timetable
        const lecturerEntries = timetable.entries.filter(
          (entry: any) => entry.lecturerId.toString() === lecturerId,
        )

        futureSessions.push({
          timetableTitle: timetable.title,
          endDate: timetable.endDate,
          sessionCount: lecturerEntries.length,
          modules: lecturerEntries.map(
            (e: any) => e.moduleId?.name || "Unknown",
          ),
        })
      }
    }

    if (futureSessions.length > 0) {
      return res.status(409).json({
        message: "Cannot delete lecturer with upcoming teaching assignments",
        details: {
          summary: `Lecturer is assigned to ${futureSessions.length} future timetable(s)`,
          sessions: futureSessions,
        },
      })
    }

    // If no future sessions, proceed with deletion
    await Lecturer.findByIdAndDelete(lecturerId)

    res.json({
      success: true,
      message: "Lecturer deleted successfully",
    })
  } catch (error) {
    console.error("Delete lecturer error:", error)
    res.status(500).json({
      message: "Failed to delete lecturer",
    })
  }
}
