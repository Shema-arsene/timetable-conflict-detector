"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Types
interface Lecturer {
  _id: string
  name: string
  email?: string
  campus: string
}

const LecturersPage = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lecturers`)
      .then((res) => res.json())
      .then((data) => setLecturers(data))
      .catch(() => setLecturers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Lecturers</h1>
          <Link href="/lecturers/new">
            <Button>Add Lecturer</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Lecturers</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-500">Loading lecturers...</p>
            ) : lecturers.length === 0 ? (
              <p className="text-sm text-gray-500">No lecturers found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Campus</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lecturers.map((lecturer) => (
                      <tr key={lecturer._id} className="border-b last:border-0">
                        <td className="py-2 font-medium">{lecturer.name}</td>
                        <td className="py-2">{lecturer.email || "—"}</td>
                        <td className="py-2">{lecturer.campus}</td>
                        <td className="py-2 text-right">
                          <Link href={`/lecturers/${lecturer._id}/edit`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LecturersPage