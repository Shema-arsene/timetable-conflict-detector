"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

interface School {
  _id: string
  name: string
  campus: string
  description?: string
}

const EditSchoolPage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const [form, setForm] = useState<School>({
    _id: "",
    name: "",
    campus: "",
    description: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Fetch school details
  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/schools/${id}`,
        )

        setForm(res.data)
      } catch (error) {
        console.error("Failed to fetch school:", error)
        alert("Failed to load school details.")
        router.push("/schools")
      } finally {
        setFetching(false)
      }
    }

    fetchSchool()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!form.name || !form.campus) {
      alert("School name and campus are required.")
      setLoading(false)
      return
    }

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/${id}`, {
        name: form.name,
        campus: form.campus,
        description: form.description,
      })

      router.push("/schools")
    } catch (error) {
      console.error("Failed to update school:", error)
      alert("Something went wrong while updating the school.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/schools/${id}`)

      router.push("/schools")
    } catch (error) {
      console.error("Failed to delete school:", error)
      alert("Failed to delete school. Make sure it has no modules attached.")
    } finally {
      setDeleting(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen max-w-3xl mx-auto p-6">
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            Loading school...
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-3xl mx-auto p-6">
      <Card className="p-3 md:p-6">
        <div>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push("/schools")}
          >
            <ArrowLeft />
          </Button>
        </div>
        <CardHeader>
          <CardTitle>Edit School</CardTitle>
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
              />
            </div>

            {/* School Campus */}
            <div className="space-y-1">
              <Label htmlFor="campus">School Campus</Label>
              <Input
                id="campus"
                name="campus"
                value={form.campus}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={form.description || ""}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={() => handleDelete()}
              >
                Delete
              </Button>

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Update School"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditSchoolPage
