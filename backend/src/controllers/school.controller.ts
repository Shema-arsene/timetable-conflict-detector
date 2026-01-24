// controllers/school.controller.ts
import { Request, Response } from "express"
import School from "../models/School.js"
import Module from "../models/Module.js"

// Get all schools
export const getSchools = async (_: Request, res: Response) => {
  const schools = await School.find().sort({ createdAt: -1 })
  res.json(schools)
}

// Get single school
export const getSchoolById = async (req: Request, res: Response) => {
  const school = await School.findById(req.params.id)
  if (!school) {
    return res.status(404).json({ message: "School not found" })
  }
  res.json(school)
}

// Create school
export const createSchool = async (req: Request, res: Response) => {
  const { name, campus, description } = req.body

  console.log("Incoming payload:", req.body)

  if (!name) {
    return res.status(400).json({ message: "Name is required" })
  }

  const exists = await School.findOne({ name })
  if (exists) {
    return res.status(409).json({ message: "This school already exists" })
  }

  const school = await School.create({
    name,
    campus,
    description,
  })

  res.status(201).json(school)
}

// Update school
export const updateSchool = async (req: Request, res: Response) => {
  const school = await School.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  if (!school) {
    return res.status(404).json({ message: "School not found" })
  }

  res.json(school)
}

// Delete school
export const deleteSchool = async (req: Request, res: Response) => {
  const moduleCount = await Module.countDocuments({
    school: req.params.id,
  })

  if (moduleCount > 0) {
    return res.status(400).json({
      message: "Cannot delete school with existing modules",
    })
  }

  const school = await School.findByIdAndDelete(req.params.id)

  if (!school) {
    return res.status(404).json({ message: "School not found" })
  }
  res.json({ message: "School deleted successfully" })
}
