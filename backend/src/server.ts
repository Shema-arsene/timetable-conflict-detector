// import express from "express"
// import cors from "cors"
// import dotenv from "dotenv"
// import { connectDB } from "./config/db"
// import router from "./routes/index"

// // Load environment variables
// dotenv.config()

// const app = express()

// // Middleware
// app.use(cors())
// app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

// // Routes
// app.use("/api", router)

// // Basic route for testing
// app.get("/", (req, res) => {
//   res.json({
//     message: "University Timetable Conflict Detector API",
//     version: "1.0.0",
//     health: "/api/health",
//     timestamp: new Date().toISOString(),
//   })
// })

// connectDB()

// const PORT = process.env.PORT || 8000

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"

// Routes
import moduleRoutes from "./routes/module.routes.js"
import lecturerRoutes from "./routes/lecturer.routes.js"

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
