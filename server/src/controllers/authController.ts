import { Request, Response } from "express"
import User from "../models/User"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "../utils/email"
import VerificationToken from "../models/VerificationToken"
import { generateRandomToken } from "../utils/generateRandomToken"

export async function register(req: Request, res: Response) {
  const { email, password } = req.body
  const existing = await User.findOne({ email })
  if (existing) return res.status(400).json({ message: "Email exists" })

  const hashed = await bcrypt.hash(password, 12)
  const user = await User.create({ email, password: hashed })

  const token = await VerificationToken.create({
    userId: user._id.toString(),
    token: generateRandomToken(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  })
  await sendVerificationEmail(user.email, token.token)

  res.status(201).json({ message: "Registered. Check email to verify." })
}

export async function verify(req: Request, res: Response) {
  const { token } = req.params
  const doc = await VerificationToken.findOne({ token }).populate("user")
  if (!doc) return res.status(400).json({ message: "Invalid token" })

  const user = doc.userId as any
  user.isVerified = true
  await user.save()
  await doc.deleteOne()

  res.json({ message: "Verified" })
}
