import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db"
import authRoutes from "./routes/authRoutes"
import timetableRoutes from "./routes/timetableRoutes"

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/timetable", timetableRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on ${PORT}`))
