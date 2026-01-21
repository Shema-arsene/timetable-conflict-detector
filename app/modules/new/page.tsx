"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CAMPUSES = ["Kacyiru", "Remera"] as const

const CreateModulePage = () => {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [campus, setCampus] = useState<(typeof CAMPUSES)[number] | "">("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!code || !name || !campus) return

    try {
      setLoading(true)
      const res = await fetch("/api/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, name, campus }),
      })

      if (!res.ok) throw new Error("Failed to create module")

      router.push("/modules")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Module</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="code">Module Code</Label>
              <Input
                id="code"
                placeholder="CS101"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Module Name</Label>
              <Input
                id="name"
                placeholder="Introduction to Programming"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Campus</Label>
              <Select
                value={campus}
                onValueChange={(value) => setCampus(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campus" />
                </SelectTrigger>
                <SelectContent>
                  {CAMPUSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Create Module"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

export default CreateModulePage
