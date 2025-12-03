import { Router } from "express"
import { createTimetable } from "../controllers/timetableController"
import { requireAuth } from "../middleware/authMiddleware"

const router = Router()
router.post("/", requireAuth, createTimetable)

export default router
