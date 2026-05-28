"use client"

import React, { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { registerUser } from "@/services/auth"
import { toast } from "sonner"

const SignUpPage = () => {
  const router = useRouter()

  const [firstName, setFirstName] = useState("")
  const [secondName, setSecondName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Password mismatch", {
        description: "Passwords do not match.",
      })
      return
    }

    if (password.length < 6) {
      toast.error("Weak password", {
        description: "Password must be at least 6 characters.",
      })
      return
    }

    setLoading(true)

    try {
      await registerUser(email, password, firstName, secondName)
      toast.success("Account created!", {
        description: "You have successfully registered.",
      })
      router.push("/")
      router.refresh()
    } catch (err: any) {
      toast.error("Registration failed", {
        description: err.response?.data?.message || "Failed to create account",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-xl p-4">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold"></CardTitle>
          <CardTitle className="text-center text-3xl font-bold">
            University of Kigali
          </CardTitle>
          <CardDescription className="text-center my-3 font-semibold">
            Create your UoK Account
          </CardDescription>
          <CardDescription className="text-xl font-semibold text-center text-gray-800">
            Admin Sign Up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            {/* Second Name */}
            <div className="space-y-2">
              <Label htmlFor="secondName">Second Name</Label>
              <Input
                id="secondName"
                type="text"
                placeholder="Enter your second name"
                value={secondName}
                onChange={(e) => setSecondName(e.target.value)}
                required
              />
            </div>

            {/* School e-mail */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@uok.ac.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Sign Up
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a href="/public/auth/signin" className="text-blue-600 underline">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage
