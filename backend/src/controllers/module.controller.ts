import { Request, Response } from "express"
import Module from "../models/Module.js"
import School from "../models/School.js"

// GET /api/modules
export const getModules = async (_req: Request, res: Response) => {
  try {
    const modules = await Module.find()
      .populate("school", "name campus")
      .sort({ createdAt: -1 })
    res.json(modules)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch modules" })
  }
}

// GET /api/modules/:id
export const getModuleById = async (req: Request, res: Response) => {
  const module = await Module.findById(req.params.id).populate(
    "school",
    "name campus",
  )
  if (!module) {
    return res.status(404).json({ message: "Module not found" })
  }
  res.json(module)
}

// GET /api/modules/:id
export const getModulesBySchool = async (req: Request, res: Response) => {
  const modules = await Module.find({
    school: req.params.schoolId,
  }).sort({ name: 1 })

  res.json(modules)
}

// POST /api/modules
export const createModule = async (req: Request, res: Response) => {
  const { name, code, school } = req.body

  if (!name || !code || !school) {
    return res.status(400).json({ message: "All fields are required" })
  }

  // Ensure school exists
  const schoolExists = await School.findById(school)
  if (!schoolExists) {
    return res.status(404).json({ message: "School not found" })
  }

  const exists = await Module.findOne({ code })
  if (exists) {
    return res.status(409).json({ message: "Module code already exists" })
  }

  const module = await Module.create({ name, code, school })
  res.status(201).json(module)
}

// PUT /api/modules/:id
export const updateModule = async (req: Request, res: Response) => {
  const { id } = req.params
  const { code, name, school } = req.body

  if (!name || !code || !school) {
    return res.status(400).json({ message: "All fields are required" })
  }

  // Ensure school exists
  const schoolExists = await School.findById(school)
  if (!schoolExists) {
    return res.status(404).json({ message: "School not found" })
  }

  const module = await Module.findByIdAndUpdate(
    id,
    { code, name, school },
    {
      new: true,
      runValidators: true,
    },
  )

  if (!module) {
    return res.status(404).json({ message: "Module not found" })
  }

  res.json(module)
}

// DELETE /api/modules/:id ?
export const deleteModule = async (req: Request, res: Response) => {
  const module = await Module.findByIdAndDelete(req.params.id)

  if (!module) {
    return res.status(404).json({ message: "Module not found" })
  }

  res.json({ message: "Module deleted successfully" })
}
