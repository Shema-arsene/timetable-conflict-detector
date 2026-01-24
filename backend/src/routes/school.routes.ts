// routes/school.routes.ts
import { Router } from "express"
import {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
} from "../controllers/school.controller.js"

const router = Router()

router.get("/", getSchools)
router.get("/:id", getSchoolById)
router.post("/", createSchool)
router.put("/:id", updateSchool)
router.delete("/:id", deleteSchool)

export default router
