"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface LecturerForm {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const EditLecturerPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [form, setForm] = useState<LecturerForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchLecturer = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/lecturers/${id}`)
      setForm({
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        email: res.data.email,
        phone: res.data.phone,
      })
    } catch (error) {
      console.error("Failed to load lecturer", error)
      alert("Failed to update lecturer")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
      await axios.put(`${API_URL}/api/lecturers/${id}`, form)
      router.push("/lecturers")
    } catch (error) {
      console.error("Failed to update lecturer", error)
      alert("Failed to update lecturer")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lecturer? This action cannot be undone.",
    )

    if (!confirmed) return

    setDeleting(true)

    try {
      await axios.delete(`${API_URL}/api/lecturers/${id}`)
      router.push("/lecturers")
    } catch (error) {
      console.error("Failed to delete lecturer", error)
      alert("Failed to delete lecturer")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <p className="p-6">Loading lecturer…</p>
  }

  return (
    <div className="min-h-screen p-6 max-w-xl">
      <Card className="p-3 md:p-6">
        <div>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            {/* Cancel */}
            <ArrowLeft />
          </Button>
        </div>
        <CardHeader>
          <CardTitle>Edit Lecturer</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
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

            <div className="flex justify-between gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete Lecturer"}
              </Button>
              <Button type="submit" disabled={saving || loading}>
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
