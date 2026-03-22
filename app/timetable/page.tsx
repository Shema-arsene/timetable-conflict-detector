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
import { FilterBar, FilterOptions } from "@/components/FilterBar"
import { toast } from "sonner"
import { ErrorState } from "@/components/ErrorState"
import { EmptyState } from "@/components/EmptyState"

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
  const [filteredTimetables, setFilteredTimetables] = useState<Timetable[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    session: "all",
    sortBy: "newest",
  })

  const fetchTimetables = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/timetables`,
      )
      setTimetables(res.data)
      toast.success("Timetables loaded successfully", {
        description: "All timetables have been successfully loaded.",
      })
    } catch (err) {
      setError("Failed to fetch timetables")
      toast.error("Failed to fetch timetables", {
        description: "There was an error fetching the timetables",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTimetables()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [timetables, filters])

  // Format date without external library
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

  const applyFilters = () => {
    let filtered = [...timetables]

    // Filter by search (title)
    if (filters.search) {
      filtered = filtered.filter((timetable) =>
        timetable.title.toLowerCase().includes(filters.search!.toLowerCase()),
      )
    }

    // Filter by session
    if (filters.session && filters.session !== "all") {
      filtered = filtered.filter(
        (timetable) => timetable.session === filters.session,
      )
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "newest":
          filtered.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          )
          break
        case "oldest":
          filtered.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          )
          break
        case "name-asc":
          filtered.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "name-desc":
          filtered.sort((a, b) => b.title.localeCompare(a.title))
          break
      }
    }

    setFilteredTimetables(filtered)
  }

  const sessionOptions = [
    { value: "day", label: "Day" },
    { value: "evening", label: "Evening" },
    { value: "weekend", label: "Weekend" },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-6xl mx-auto p-6">
          <div className="text-center py-8">Loading timetables...</div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <Card className="max-w-6xl mx-auto p-6">
          <div className="text-center py-8 text-red-600">{error}</div>
        </Card>
      </div>
    )
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
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={timetables.length}
            filteredCount={filteredTimetables.length}
            showSessionFilter={true}
            showSortBy={true}
            searchPlaceholder="Search by title..."
            sessionOptions={sessionOptions}
          />

          {error && <ErrorState message={error} onRetry={fetchTimetables} />}

          {!loading && filteredTimetables.length === 0 ? (
            <EmptyState type="timetables" />
          ) : (
            <div className="mt-4">
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
                  {filteredTimetables.map((timetable) => (
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TimetablesPage
