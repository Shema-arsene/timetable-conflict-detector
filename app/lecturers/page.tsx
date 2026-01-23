"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lecturer } from "../../types/lecturer"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const LecturersPage = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAllLecturers = async (): Promise<void> => {
    try {
      setLoading(true)

      const res = await axios.get<Lecturer[]>(`${API_URL}/api/lecturers`)

      const data: Lecturer[] = res.data

      setLecturers(data)
    } catch (error) {
      console.error("Error fetching lecturers:", error)
      setLecturers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllLecturers()
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

        <Card className="p-3 md:p-6">
          <CardHeader>
            <CardTitle>All Lecturers</CardTitle>
          </CardHeader>

          <CardContent>
            {loading ? (
              <p className="text-sm text-gray-500">Loading lecturers...</p>
            ) : lecturers.length === 0 ? (
              <p className="text-sm text-gray-500">No lecturers found.</p>
            ) : (
              <div className="overflow-x-auto p-1 md:p-3">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Phone</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lecturers.map((lecturer) => (
                      <tr key={lecturer._id} className="border-b last:border-0">
                        <td className="py-2 font-medium whitespace-nowrap pr-2">
                          {lecturer.firstName} {lecturer.lastName}
                        </td>
                        <td className="py-2 whitespace-nowrap px-2">
                          {lecturer.email}
                        </td>
                        <td className="py-2 whitespace-nowrap px-2">
                          {lecturer.phone}
                        </td>
                        <td className="py-2 text-right whitespace-nowrap pl-2">
                          <Link href={`/lecturers/${lecturer._id}`}>
                            <Button variant="secondary" size="sm">
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
