import { Router } from "express"

const router = Router()

// Test route
router.get("/health", (req, res) => {
  res
    .status(200)
    .json({
      status: "OK",
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
    })
})

export default router
