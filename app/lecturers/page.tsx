"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lecturer } from "../../types/lecturer"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CAMPUSES } from "@/constants/campus"
import { FilterBar, FilterOptions } from "@/components/FilterBar"
import { EmptyState } from "@/components/EmptyState"

const API_URL = process.env.NEXT_PUBLIC_API_URL

const LecturersPage = () => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredLecturers, setFilteredLecturers] = useState<Lecturer[]>([])
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    campus: "all",
    sortBy: "name-asc",
  })

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

  const applyFilters = () => {
    let filtered = [...lecturers]

    // Filter by search (first name + last name)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter((lecturer) =>
        `${lecturer.firstName} ${lecturer.lastName}`
          .toLowerCase()
          .includes(searchLower),
      )
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "name-asc":
          filtered.sort((a, b) =>
            `${a.firstName} ${a.lastName}`.localeCompare(
              `${b.firstName} ${b.lastName}`,
            ),
          )
          break
        case "name-desc":
          filtered.sort((a, b) =>
            `${b.firstName} ${b.lastName}`.localeCompare(
              `${a.firstName} ${a.lastName}`,
            ),
          )
          break
        case "newest":
          filtered.sort((a, b) => b._id.localeCompare(a._id))
          break
        case "oldest":
          filtered.sort((a, b) => a._id.localeCompare(b._id))
          break
      }
    }

    setFilteredLecturers(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [lecturers, filters])

  const campusOptions = CAMPUSES.map((campus) => ({
    value: campus,
    label: campus,
  }))

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
            <FilterBar
              filters={filters}
              onFiltersChange={setFilters}
              totalCount={lecturers.length}
              filteredCount={filteredLecturers.length}
              showCampusFilter={true}
              showSortBy={true}
              searchPlaceholder="Search by name..."
              campusOptions={campusOptions}
            />

            {!loading && filteredLecturers.length === 0 ? (
              <EmptyState type="lecturers" />
            ) : (
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLecturers.map((lecturer) => (
                      <TableRow key={lecturer._id}>
                        <TableCell className="font-semibold">
                          {lecturer.firstName} {lecturer.lastName}
                        </TableCell>
                        <TableCell>{lecturer.email}</TableCell>
                        <TableCell>{lecturer.phone || "—"}</TableCell>
                        <TableCell className="text-right">
                          <Link href={`/lecturers/${lecturer._id}`}>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </Link>
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
    </div>
  )
}

export default LecturersPage
