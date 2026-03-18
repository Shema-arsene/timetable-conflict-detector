import { Request, Response } from "express"
import Timetable from "../models/Timetable.js"
import { detectConflicts } from "../utils/detectConflicts.js"

// POST /api/timetable
export const createTimetable = async (req: Request, res: Response) => {
  try {
    const { title, session, startDate, endDate, entries } = req.body

    // Basic validation
    if (!title || !session || !startDate || !endDate || !entries?.length) {
      return res.status(400).json({
        message: "All fields are required",
      })
    }

    // Check for conflicts
    const conflicts = detectConflicts(entries)
    if (conflicts.length > 0) {
      return res.status(409).json({
        message: "Timetable has conflicts",
        conflicts,
      })
    }

    // Create timetable
    const timetable = await Timetable.create({
      title,
      session,
      startDate,
      endDate,
      entries, // entries already has moduleId, lecturerId, etc.
    })

    // Populate for response
    const populated = await Timetable.findById(timetable._id)
      .populate("entries.schoolId", "name")
      .populate("entries.moduleId", "name code")
      .populate("entries.lecturerId", "firstName lastName")
      .populate("entries.roomId", "name campus")

    res.status(201).json({
      success: true,
      message: "Timetable created successfully",
      timetable: populated,
    })
  } catch (error) {
    console.error("Create timetable error:", error)
    res.status(500).json({
      message: "Failed to create timetable",
    })
  }
}

// GET /api/timetable
export const getTimetables = async (_req: Request, res: Response) => {
  try {
    const timetables = await Timetable.find()
      .populate("entries.schoolId", "name")
      .populate("entries.moduleId", "name code")
      .populate("entries.lecturerId", "firstName lastName")
      .populate("entries.roomId", "name campus")
      .sort({ createdAt: -1 })

    res.json(timetables)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch timetables" })
  }
}

// GET /api/timetable/:id
export const getTimetableById = async (req: Request, res: Response) => {
  try {
    const timetable = await Timetable.findById(req.params.id)
      .populate("entries.schoolId", "name")
      .populate("entries.moduleId", "name code")
      .populate("entries.lecturerId", "firstName lastName")
      .populate("entries.roomId", "name campus")

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" })
    }

    res.json(timetable)
  } catch (error) {
    res.status(400).json({ message: "Invalid timetable ID" })
  }
}

// PUT /api/timetable/:id
export const updateTimetable = async (req: Request, res: Response) => {
  try {
    const { title, session, startDate, endDate, entries } = req.body

    // Check conflicts if entries are being updated
    if (entries) {
      const conflicts = detectConflicts(entries)
      if (conflicts.length > 0) {
        return res.status(409).json({
          message: "Timetable has conflicts",
          conflicts,
        })
      }
    }

    const timetable = await Timetable.findByIdAndUpdate(
      req.params.id,
      { title, session, startDate, endDate, entries },
      { new: true, runValidators: true },
    ).populate(
      "entries.schoolId entries.moduleId entries.lecturerId entries.roomId",
    )

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" })
    }

    res.json(timetable)
  } catch (error) {
    res.status(400).json({ message: "Failed to update timetable" })
  }
}

// DELETE /api/timetable/:id
export const deleteTimetable = async (req: Request, res: Response) => {
  try {
    const timetable = await Timetable.findByIdAndDelete(req.params.id)

    if (!timetable) {
      return res.status(404).json({ message: "Timetable not found" })
    }

    res.json({ message: "Timetable deleted successfully" })
  } catch (error) {
    res.status(400).json({ message: "Failed to delete timetable" })
  }
}
