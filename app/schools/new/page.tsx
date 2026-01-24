"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { CAMPUSES } from "@/constants/campus"

const NewSchoolPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    campus: "",
    description: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!form.name || !form.campus) {
      setError("School name and campus are required")
      alert("School name and campus are required.")
      setLoading(false)
      return
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/schools`, form)
      router.push("/schools")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create school")
      alert("Something went wrong while creating the school.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto p-6">
      <Card className="p-3 md:p-6">
        <CardHeader>
          <CardTitle>Create New School</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* School Name */}
            <div className="space-y-1">
              <Label htmlFor="name">School Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. School of Engineering"
              />
            </div>

            {/* School Campus */}
            <div className="space-y-1">
              <Label htmlFor="campus">School Campus</Label>

              <select
                id="campus"
                name="campus"
                value={form.campus}
                onChange={(e) => setForm({ ...form, campus: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="" disabled>
                  Select campus
                </option>

                {CAMPUSES.map((campus) => (
                  <option key={campus} value={campus}>
                    {campus}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/schools")}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Create School"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewSchoolPage
