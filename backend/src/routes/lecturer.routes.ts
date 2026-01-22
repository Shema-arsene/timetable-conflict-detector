import { Router } from "express"
import {
  getLecturers,
  getLecturerById,
  createLecturer,
  updateLecturer,
  deleteLecturer,
} from "../controllers/lecturer.controller.js"

const router = Router()

router.get("/", getLecturers)
router.get("/:id", getLecturerById)
router.post("/", createLecturer)
router.put("/:id", updateLecturer)
router.delete("/:id", deleteLecturer)

export default router
