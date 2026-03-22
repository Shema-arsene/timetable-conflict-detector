"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

type RoomForm = {
  name: string
  campus: string
  capacity: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

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
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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

  useEffect(() => {
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

  const handleDelete = async () => {
    setDeleting(true)
    const loadingToast = toast.loading("Deleting room...")

    try {
      await axios.delete(`${API_URL}/api/rooms/${id}`)
      toast.dismiss(loadingToast)
      toast.success("Room deleted", {
        description: "The room has been permanently removed.",
      })
      router.push("/rooms")
    } catch (err: any) {
      toast.dismiss(loadingToast)
      toast.error("Deletion failed", {
        description: err.response?.data?.message || "Failed to delete room",
      })
      setDeleting(false)
      setDeleteDialogOpen(false)
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
      <Card className="w-full max-w-lg p-3 md:p-6 py-6">
        <div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/rooms")}
          >
            <ArrowLeft />
          </Button>
        </div>
        <CardHeader className="">
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

            <div className="flex items-center justify-between gap-2 pt-2">
              <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    Delete Room
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the room &quot;{form.name}&quot; and remove it from all
                      timetables.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleting ? "Deleting..." : "Yes, delete it"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Update Room"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditRoomPage
