"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
// import { useToast } from "@/components/ui/use-toast"

import axios from "axios"

interface School {
  _id: string
  name: string
}

interface ModuleForm {
  code: string
  name: string
  school: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const EditModulePage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  //   const { toast } = useToast()

  const [form, setForm] = useState<ModuleForm>({
    code: "",
    name: "",
    school: "",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [schools, setSchools] = useState<School[]>([])
  const [deleting, setDeleting] = useState(false)

  const fetchSchools = async () => {
    const { data } = await axios.get(`${API_URL}/api/schools`)
    setSchools(data)
  }

  const fetchModule = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/modules/${id}`)
      const data = await res.data

      setForm({
        code: data.code,
        name: data.name,
        school: data.school._id,
      })
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: "Could not load module",
      //   variant: "destructive",
      // })
      console.error(error)
      router.push("/modules")
    } finally {
      setLoading(false)
    }
  }

  // Fetch schools for select dropdown
  useEffect(() => {
    fetchSchools()
  }, [])

  // Fetch existing module
  useEffect(() => {
    fetchModule()
  }, [id, router])

  function updateField<K extends keyof ModuleForm>(
    key: K,
    value: ModuleForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleUpdate = async () => {
    if (!form.code || !form.name || !form.school) {
      //   toast({
      //     title: "Validation error",
      //     description: "All fields are required",
      //     variant: "destructive",
      //   })
      return
    }

    try {
      setSaving(true)

      await axios.put(`${API_URL}/api/modules/${id}`, {
        code: form.code,
        name: form.name,
        school: form.school,
      })

      //   toast({
      //     title: "Module updated",
      //     description: "Changes saved successfully",
      //   })

      router.push("/modules")
    } catch (error) {
      //   toast({
      //     title: "Error",
      //     description: "Failed to update module",
      //     variant: "destructive",
      //   })
      console.error("Failed to update module:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this module? This action cannot be undone.",
    )

    if (!confirmed) return

    try {
      setDeleting(true)
      await axios.delete(`${API_URL}/api/modules/${id}`)
      router.push("/modules")
    } catch (error) {
      console.error("Failed to delete module:", error)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading module...</div>
  }

  return (
    <section className="min-h-screen p-6 max-w-3xl mx-auto">
      <Card className="p-3 md:p-6">
        <div>
          <Button variant="ghost" onClick={() => router.push("/modules")}>
            <ArrowLeft />
          </Button>
        </div>
        <CardHeader>
          <CardTitle>Edit Module</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Module Code</Label>
            <Input
              value={form.code}
              onChange={(e) => updateField("code", e.target.value)}
            />
          </div>

          <div>
            <Label>Module Name</Label>
            <Input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>School</Label>
            <select
              value={form.school}
              onChange={(e) => updateField("school", e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="" disabled>
                Select school
              </option>
              {schools.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-2 pt-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Module"}
            </Button>

            <Button onClick={handleUpdate} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default EditModulePage
