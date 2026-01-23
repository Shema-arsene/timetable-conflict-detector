"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"

const AddLecturerPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!form.firstName || !form.lastName || !form.email) {
      alert("Please fill in all required fields.")
      setLoading(false)
      return
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lecturers`, 
        form
      )

      router.push("/lecturers")
    } catch (error) {
      console.error(error)
       alert("Failed to create lecturer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Add Lecturer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Create Lecturer"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddLecturerPage
