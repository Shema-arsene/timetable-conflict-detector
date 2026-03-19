"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil } from "lucide-react"

type Timetable = {
  _id: string
  title: string
  session: "day" | "evening" | "weekend"
  startDate: string
  endDate: string
  entries: any[]
  createdAt: string
}

const TimetablesPage = () => {
  const [timetables, setTimetables] = useState<Timetable[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/timetables`,
        )
        setTimetables(res.data)
      } catch (err) {
        setError("Failed to fetch timetables")
      } finally {
        setLoading(false)
      }
    }

    fetchTimetables()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  const getSessionBadge = (session: string) => {
    const colors = {
      day: "bg-blue-100 text-blue-800",
      evening: "bg-purple-100 text-purple-800",
      weekend: "bg-green-100 text-green-800",
    }
    return colors[session as keyof typeof colors] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-6xl mx-auto p-3 md:p-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Timetables</CardTitle>
          <Link href="/timetable/new">
            <Button>Create Timetable</Button>
          </Link>
        </CardHeader>

        <CardContent>
          {loading && <p>Loading timetables...</p>}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && timetables.length === 0 && (
            <p className="text-sm text-gray-600">
              No timetables found. Create one to get started.
            </p>
          )}

          {!loading && timetables.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Entries</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {timetables.map((timetable) => (
                  <TableRow key={timetable._id}>
                    <TableCell className="font-semibold max-w-xs truncate">
                      {timetable.title}
                    </TableCell>

                    <TableCell>
                      <Badge className={getSessionBadge(timetable.session)}>
                        {timetable.session.charAt(0).toUpperCase() +
                          timetable.session.slice(1)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {formatDate(timetable.startDate)} -{" "}
                      {formatDate(timetable.endDate)}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline">
                        {timetable.entries.length}{" "}
                        {timetable.entries.length === 1 ? "entry" : "entries"}
                      </Badge>
                    </TableCell>

                    <TableCell>{formatDate(timetable.createdAt)}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/timetable/${timetable._id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </Link>

                        <Link href={`/timetable/edit/${timetable._id}`}>
                          <Button size="sm" variant="outline">
                            <Pencil className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TimetablesPage
