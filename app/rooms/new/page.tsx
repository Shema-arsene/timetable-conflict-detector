"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

import { CAMPUSES } from "@/constants/campus"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type RoomPayload = {
  name: string
  campus: string
  capacity: number
}

const AddRoomPage = () => {
  const router = useRouter()

  const [form, setForm] = useState<RoomPayload>({
    name: "",
    campus: "",
    capacity: 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }))
  }

  const handleCampusChange = (value: string) => {
    setForm((prev) => ({ ...prev, campus: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    if (!form.name || !form.campus || form.capacity <= 100) {
      toast.error("Error creating room", {
        description: "Please fill in all fields with valid values.",
      })
      return
    }
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`, form)
      toast.success("Room created successfully", {
        description: "The room has been created.",
      })
      router.push("/rooms")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create room")
      toast.error("Failed to create room", {
        description: "There was an error creating room.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <Card className="w-full max-w-lg p-3 md:p-6 py-6">
        <CardHeader>
          <CardTitle className="text-xl">Add New Room</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Room Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Lab 1, Kivu"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campus */}
            {/* <div className="space-y-1">
              <Label htmlFor="campus">Campus</Label>
              <Input
                id="campus"
                name="campus"
                placeholder="e.g. Kacyiru"
                value={form.campus}
                onChange={handleChange}
                required
              />
            </div> */}

            <div className="space-y-1">
              <Label htmlFor="campus">Campus</Label>
              <Select
                value={form.campus}
                onValueChange={handleCampusChange}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a campus" />
                </SelectTrigger>
                <SelectContent>
                  {CAMPUSES.map((campus) => (
                    <SelectItem key={campus} value={campus}>
                      {campus}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Capacity */}
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

            <div className="flex items-center justify-between gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/rooms")}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Create Room"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddRoomPage
