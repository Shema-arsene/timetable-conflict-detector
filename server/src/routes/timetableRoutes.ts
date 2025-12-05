import { Router } from "express"
import { createTimetable } from "../controllers/timetableController"
import { authMiddleware } from "../middleware/authMiddleware"

const router = Router()
router.post("/", authMiddleware as any, createTimetable as any)

export default router
