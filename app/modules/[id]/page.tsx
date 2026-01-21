"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
// import { useToast } from "@/components/ui/use-toast"

const CAMPUSES = ["Kacyiru", "Remera"] as const

type Campus = (typeof CAMPUSES)[number]

interface ModuleForm {
  code: string
  name: string
  campus: Campus
}

const EditModulePage = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  //   const { toast } = useToast()

  const [form, setForm] = useState<ModuleForm>({
    code: "",
    name: "",
    campus: "Kacyiru",
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch existing module
  useEffect(() => {
    async function fetchModule() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/modules/${id}`,
        )
        if (!res.ok) throw new Error("Failed to fetch module")
        const data = await res.json()

        setForm({
          code: data.code,
          name: data.name,
          campus: data.campus,
        })
      } catch (err) {
        // toast({
        //   title: "Error",
        //   description: "Could not load module",
        //   variant: "destructive",
        // })
        router.push("/modules")
      } finally {
        setLoading(false)
      }
    }

    fetchModule()
    //   }, [id, router, toast])
  }, [id, router])

  function updateField<K extends keyof ModuleForm>(
    key: K,
    value: ModuleForm[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleUpdate() {
    if (!form.code || !form.name) {
      //   toast({
      //     title: "Validation error",
      //     description: "All fields are required",
      //     variant: "destructive",
      //   })
      return
    }

    setSaving(true)

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/modules/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      )

      if (!res.ok) throw new Error("Update failed")

      //   toast({
      //     title: "Module updated",
      //     description: "Changes saved successfully",
      //   })

      router.push("/modules")
    } catch (err) {
      //   toast({
      //     title: "Error",
      //     description: "Failed to update module",
      //     variant: "destructive",
      //   })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-6">Loading module...</div>
  }

  return (
    <section className="min-h-screen p-6 max-w-3xl mx-auto">
      <Card>
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

          <div>
            <Label>Campus</Label>
            <select
              value={form.campus}
              onChange={(e) => updateField("campus", e.target.value as Campus)}
              className="w-full border rounded px-3 py-2"
            >
              {CAMPUSES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => router.push("/modules")}>
              Cancel
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
