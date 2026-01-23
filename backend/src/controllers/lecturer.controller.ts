import { Request, Response } from "express"
import Lecturer from "../models/Lecturer.js"

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
  const lecturer = await Lecturer.findByIdAndDelete(req.params.id)
  if (!lecturer) {
    return res.status(404).json({ message: "Lecturer not found" })
  }
  res.json({ message: "Lecturer deleted successfully" })
}
