"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface LecturerForm {
  name: string
  email: string
  campus: string
}

const EditLecturerPage = () => {
  const { id } = useParams()
  const router = useRouter()

  const [form, setForm] = useState<LecturerForm>({
    name: "",
    email: "",
    campus: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchLecturer = async () => {
      try {
        const res = await axios.get(`/api/lecturers/${id}`)
        setForm({
          name: res.data.name,
          email: res.data.email,
          campus: res.data.campus,
        })
      } catch (error) {
        console.error("Failed to load lecturer", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLecturer()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await axios.put(`/api/lecturers/${id}`, form)
      router.push("/lecturers")
    } catch (error) {
      console.error("Failed to update lecturer", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="p-6">Loading lecturer…</p>
  }

  return (
    <div className="p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Lecturer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campus">Campus</Label>
              <Input
                id="campus"
                name="campus"
                value={form.campus}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditLecturerPage
