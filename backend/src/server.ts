import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db"
import router from "./routes/index"

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api", router)

// Basic route for testing
app.get("/", (req, res) => {
  res.json({
    message: "University Timetable Conflict Detector API",
    version: "1.0.0",
    health: "/api/health",
    timestamp: new Date().toISOString(),
  })
})

connectDB()

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
