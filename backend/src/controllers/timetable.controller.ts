// import { Request, Response } from "express"

// // Models
// import Timetable from "../models/Timetable.js"
// // import Room from "../models/Room.js"

// // Utils
// // import {
// //   isStartTimeInFuture,
// //   isValidTimeRange,
// // } from "../utils/timeValidation.js"
// import { detectConflicts } from "../utils/detectTimetableConflicts.js"
// import { buildTimetableSlots } from "../services/buildTimetableSlots.js"

// // Types
// import { TimetableSlot } from "../types/timetable.js"

// // POST /api/timetable/
// export const createTimetable = async (req: Request, res: Response) => {
//   try {
//     const { heading, session, startDate, endDate, schools } =
//       req.body

//     // Validation checks
//     if (!heading || heading.trim().length < 5) {
//       return res.status(400).json({
//         message: "Timetable heading is required and must be meaningful",
//       })
//     }

//     if (!session || !startDate || !endDate || !schools) {
//       return res.status(400).json({ message: "Missing required fields" })
//     }

//     if (new Date(startDate) >= new Date(endDate)) {
//       return res.status(400).json({ message: "Invalid date range" })
//     }

//     // Build unified slots
//     const slots: TimetableSlot[] = await buildTimetableSlots({
//       schools,
//       session,
//       startDate,
//     })

//     // Normalize slots (Single Source of Truth)
//     // let slots: TimetableSlot[] = []

//     // // Auto-Generation logic (if no modules provided)

//     // Authoritative Conflict Check
//     // const conflicts = detectConflicts(schools)
//     const conflicts = detectConflicts(slots)

//     if (conflicts.length > 0) {
//       return res.status(409).json({
//         message: "Timetable conflicts detected",
//         conflicts,
//       })
//     }

//     // Normalize for BD
//     const normalizedSchools = schools.map(
//       (school: {
//         schoolId: string
//         modules: {
//           moduleId: string
//           lecturerId: string
//           roomId: string
//           campus: "Kacyiru" | "Remera"
//           startTime: string
//           endTime: string
//         }[]
//       }) => ({
//         schoolId: school.schoolId,
//         modules: school.modules.map((module: any) => ({
//           moduleId: module.moduleId,
//           lecturerId: module.lecturerId,
//           roomId: module.roomId,
//           campus: module.campus,
//           startTime: module.startTime,
//           endTime: module.endTime,
//         })),
//       }),
//     )

//     // Create timetable
//     const timetable = await Timetable.create({
//       heading,
//       session,
//       startDate,
//       endDate,
//       schools: normalizedSchools,
//     })

//     res
//       .status(201)
//       .json({ message: "Timetable created successfully", timetable })
//   } catch (err) {
//     console.error("Create timetable error:", err)
//     res.status(500).json({ message: `Failed to create timetable: ${err}` })
//   }
// }

// // POST /api/timetable/preview
// export const previewTimetable = async (req: Request, res: Response) => {
//   try {
//     const { schools, session, startDate = false } = req.body

//     if (!schools || !session || !startDate) {
//       return res.status(400).json({ message: "Missing required fields" })
//     }

//     const slots = await buildTimetableSlots({
//       schools,
//       session,
//       startDate,
//     })

//     const conflicts = detectConflicts(slots)

//     return res.status(200).json({
//       slots,
//       conflicts,
//       canSave: conflicts.length === 0,
//     })
//   } catch (err: any) {
//     return res.status(400).json({
//       message: err.message || "Failed to preview timetable",
//     })
//   }
// }

// backend/src/controllers/timetable.controller.ts
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
