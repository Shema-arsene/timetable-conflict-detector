import { Request, Response } from "express"
import Room from "../models/Room.js"

// Get all rooms
export const getRooms = async (_req: Request, res: Response) => {
  try {
    const rooms = await Room.find().sort({ campus: 1, name: 1 })
    res.json(rooms)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms" })
  }
}

// Get single room
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.id)
    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }
    res.json(room)
  } catch {
    res.status(400).json({ message: "Invalid room ID" })
  }
}

// Create room
export const createRoom = async (req: Request, res: Response) => {
  try {
    const { name, campus, capacity } = req.body

    if (!name || !campus) {
      return res.status(400).json({
        message: "Room name and campus are required",
      })
    }

    const room = await Room.create({ name, campus, capacity })
    res.status(201).json(room)
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Room already exists on this campus",
      })
    }
    res.status(500).json({ message: "Failed to create room" })
  }
}

// Update room
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    res.json(room)
  } catch {
    res.status(400).json({ message: "Failed to update room" })
  }
}

// Delete room
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id)

    if (!room) {
      return res.status(404).json({ message: "Room not found" })
    }

    res.json({ message: "Room deleted successfully" })
  } catch {
    res.status(400).json({ message: "Failed to delete room" })
  }
}
