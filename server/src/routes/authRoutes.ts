import { Router } from "express"
import { register, verify } from "../controllers/authController"

const router = Router()
router.post("/register", register)
router.get("/verify/:token", verify)

export default router
