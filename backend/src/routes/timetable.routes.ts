import { Router } from "express"
import { createTimetable } from "../controllers/timetable.controller.js"

const router = Router()

router.post("/", createTimetable)

export default router
