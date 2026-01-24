import { Router } from "express"
import {
  getModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
  getModulesBySchool,
} from "../controllers/module.controller.js"

const router = Router()

router.get("/", getModules)
router.get("/school/:schoolId", getModulesBySchool)
router.get("/:id", getModuleById)
router.post("/", createModule)
router.put("/:id", updateModule)
router.delete("/:id", deleteModule)

export default router
