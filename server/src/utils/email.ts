import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
})

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${process.env.FRONTEND_URL}/auth/verify/${token}`
  await transporter.sendMail({
    to: email,
    subject: "Verify your account",
    html: `Click <a href="${url}">here</a> to verify.`,
  })
}
