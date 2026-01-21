import { Request, Response } from "express"
import Module from "../models/Module.js"

// GET /api/modules
export const getModules = async (_req: Request, res: Response) => {
  const modules = await Module.find().sort({ createdAt: -1 })
  res.json(modules)
}

// GET /api/modules/:id
export const getModuleById = async (req: Request, res: Response) => {
  const module = await Module.findById(req.params.id)
  if (!module) {
    return res.status(404).json({ message: "Module not found" })
  }
  res.json(module)
}

// POST /api/modules
export const createModule = async (req: Request, res: Response) => {
  const { name, code, campus } = req.body

  if (!name || !code || !campus) {
    return res.status(400).json({ message: "All fields are required" })
  }

  const exists = await Module.findOne({ code })
  if (exists) {
    return res.status(409).json({ message: "Module code already exists" })
  }

  const module = await Module.create({ name, code, campus })
  res.status(201).json(module)
}

// PUT /api/modules/:id
export const updateModule = async (req: Request, res: Response) => {
  const module = await Module.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

  if (!module) {
    return res.status(404).json({ message: "Module not found" })
  }

  res.json(module)
}

// DELETE /api/modules/:id
export const deleteModule = async (req: Request, res: Response) => {
  const module = await Module.findByIdAndDelete(req.params.id)

  if (!module) {
    return res.status(404).json({ message: "Module not found" })
  }

  res.json({ message: "Module deleted successfully" })
}
