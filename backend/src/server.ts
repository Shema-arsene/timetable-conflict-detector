import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"

// Routes
import moduleRoutes from "./routes/module.routes.js"
import lecturerRoutes from "./routes/lecturer.routes.js"
import roomRoutes from "./routes/room.routes.js"
import timetableRoutes from "./routes/timetable.routes.js"
import schoolRoutes from "./routes/school.routes.js"

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use("/api/modules", moduleRoutes)
app.use("/api/lecturers", lecturerRoutes)
app.use("/api/rooms", roomRoutes)
app.use("/api/timetables", timetableRoutes)
app.use("/api/schools", schoolRoutes)

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "OK",
    service: "University Timetable Conflict Detector API",
    timestamp: new Date().toISOString(),
  })
})

// Root route
app.get("/", (_req, res) => {
  res.json({
    message: "University Timetable Conflict Detector API",
    version: "1.0.0",
    health: "/api/health",
  })
})

// Database & Server

connectDB()

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
