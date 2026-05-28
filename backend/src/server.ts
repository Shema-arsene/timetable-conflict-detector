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
import authRoutes from "./routes/auth.routes.js"

// Load environment variables
dotenv.config()

// CORS configuration
const allowedOrigins = [
  "https://timetable-conflict-detector.vercel.app", // Your actual Vercel frontend URL
  "http://localhost:3000", // Local development
  "http://localhost:3001",
  "https://timetable-conflict-detector.onrender.com", // Backend itself
]

const app = express()

// Middleware
// app.use(cors())
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true)

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        process.env.NODE_ENV !== "production"
      ) {
        callback(null, true)
      } else {
        console.log("Blocked origin:", origin)
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use("/api/modules", moduleRoutes)
app.use("/api/lecturers", lecturerRoutes)
app.use("/api/rooms", roomRoutes)
app.use("/api/timetables", timetableRoutes)
app.use("/api/schools", schoolRoutes)
app.use("/api/auth", authRoutes)

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

export default app
