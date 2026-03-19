"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock, ArrowLeft, Pencil } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import ExportOptions from "@/components/ExportOptions"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const TimetableDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const [timetable, setTimetable] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchTimetable = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/timetables/${params.id}`)
      setTimetable(response.data)
    } catch (error) {
      console.error("Failed to fetch timetable:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimetable()
  }, [params.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-6xl mx-auto p-6">
          <div className="text-center py-8">Loading timetable...</div>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-6xl mx-auto p-6">
          <div className="text-center py-8">Loading timetable...</div>
        </Card>
      </div>
    )
  }

  if (!timetable) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-6xl mx-auto p-6">
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold mb-2">Timetable not found</h2>
            <Link href="/timetable">
              <Button>Back to Timetables</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 print:bg-white print:p-0">
      <Card className="max-w-7xl mx-auto p-3 md:p-6 print:shadow-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <ExportOptions timetable={timetable} fileName={timetable.title} />
            <Link href={`/timetable/edit/${params.id}`}>
              <Button variant="outline">
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Timetable Content */}
        <div className="print:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 print:text-black">
            {timetable.title}
          </h1>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="outline" className="text-sm">
              {timetable.session.charAt(0).toUpperCase() +
                timetable.session.slice(1)}{" "}
              Session
            </Badge>
            <Badge
              variant="outline"
              className="text-sm flex items-center gap-1"
            >
              <CalendarDays className="w-4 h-4" />
              {formatDate(timetable.startDate)} -{" "}
              {formatDate(timetable.endDate)}
            </Badge>
          </div>

          {/* Timetable Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 print:bg-gray-200">
                  <th className="border p-2 text-left">School</th>
                  <th className="border p-2 text-left">Module</th>
                  <th className="border p-2 text-left">Lecturer</th>
                  <th className="border p-2 text-left">Room</th>
                  <th className="border p-2 text-left">Campus</th>
                  <th className="border p-2 text-left">Time</th>
                </tr>
              </thead>
              <tbody>
                {timetable.entries.map((entry: any, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 print:hover:bg-white"
                  >
                    <td className="border p-2">
                      {entry.schoolId?.name || "N/A"}
                    </td>
                    <td className="border p-2">
                      <div>{entry.moduleId?.name || "N/A"}</div>
                      {entry.moduleId?.code && (
                        <div className="text-xs text-gray-500">
                          {entry.moduleId.code}
                        </div>
                      )}
                    </td>
                    <td className="border p-2">
                      {entry.lecturerId
                        ? `${entry.lecturerId.firstName} ${entry.lecturerId.lastName}`
                        : "N/A"}
                    </td>
                    <td className="border p-2">
                      {entry.roomId?.name || "N/A"}
                    </td>
                    <td className="border p-2">
                      <Badge variant="outline" className="text-xs">
                        {entry.campus}
                      </Badge>
                    </td>
                    <td className="border p-2">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400 print:hidden" />
                        <span>
                          {entry.startTime} - {entry.endTime}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-right">
            Created: {formatDate(timetable.createdAt)}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default TimetableDetailPage
