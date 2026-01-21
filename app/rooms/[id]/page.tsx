"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type RoomForm = {
  name: string
  campus: string
  capacity: number
}

const EditRoomPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [form, setForm] = useState<RoomForm>({
    name: "",
    campus: "",
    capacity: 0,
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${id}`,
        )
        setForm({
          name: res.data.name,
          campus: res.data.campus,
          capacity: res.data.capacity,
        })
      } catch {
        setError("Failed to load room details")
      } finally {
        setLoading(false)
      }
    }

    fetchRoom()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rooms/${id}`,
        form,
      )
      router.push("/rooms")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update room")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading room...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Edit Room</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="campus">Campus</Label>
              <Input
                id="campus"
                name="campus"
                value={form.campus}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min={0}
                value={form.capacity}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Update Room"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/rooms")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditRoomPage
