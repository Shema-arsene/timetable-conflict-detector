"use client"

import { useState, FormEvent } from "react"
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

const SignInPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  //   alert("Signin Page")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    // TODO: Replace with your Node.js backend login endpoint
    console.log({ email, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-xl p-4">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">
            University of Kigali
          </CardTitle>
          <CardDescription className="text-center my-3 font-semibold">
            Timetable Management System
          </CardDescription>
          <CardDescription className="text-xl font-semibold text-center text-gray-800">
            Admin Sign In
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">University Email:</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@uok.ac.rw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Sign In
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-blue-600 underline">
              Create one
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInPage
