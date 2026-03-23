"use client"

import { useState, FormEvent, useEffect } from "react"
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
import { toast } from "sonner"

import axios from "axios"

interface School {
  _id: string
  name: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const CreateModulePage = () => {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [name, setName] = useState("")
  const [schools, setSchools] = useState<School[]>([])
  const [school, setSchool] = useState("")
  const [loading, setLoading] = useState(false)

  const fetchSchools = async () => {
    axios.get(`${API_URL}/api/schools`).then((res) => setSchools(res.data))
  }

  useEffect(() => {
    fetchSchools()
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!code || !name || !school) {
      toast.error("Error creating module", {
        description: "Please fill in all the required fields.",
      })
      return
    }

    try {
      setLoading(true)
      const res = await axios.post(`${API_URL}/api/modules`, {
        code,
        name,
        school,
      })

      toast.success("Module created successfully", {
        description: "The module has been successfully created.",
      })

      router.push("/modules")
    } catch (error) {
      toast.error("Failed to create module", {
        description: "There was an error creating the module.",
      })
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen p-6 max-w-xl">
      <Card className="p-3 md:p-6">
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
              <Label>School</Label>
              <Select value={school} onValueChange={setSchool}>
                <SelectTrigger>
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((s) => (
                    <SelectItem key={s._id} value={s._id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
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
