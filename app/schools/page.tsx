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
import { CAMPUSES } from "@/constants/campus"
import { FilterBar, FilterOptions } from "@/components/FilterBar"

type School = {
  _id: string
  name: string
  campus: string
  description: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const SchoolsPage = () => {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredSchools, setFilteredSchools] = useState<School[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    campus: "all",
    sortBy: "name-asc",
  })

  const fetchSchools = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/schools`)
      setSchools(res.data)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch schools")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchools()
  }, [])

  const applyFilters = () => {
    let filtered = [...schools]

    // Filter by search (school name)
    if (filters.search) {
      filtered = filtered.filter((school) =>
        school.name.toLowerCase().includes(filters.search!.toLowerCase()),
      )
    }

    // Filter by campus
    if (filters.campus && filters.campus !== "all") {
      filtered = filtered.filter((school) => school.campus === filters.campus)
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "name-asc":
          filtered.sort((a, b) => a.name.localeCompare(b.name))
          break
        case "name-desc":
          filtered.sort((a, b) => b.name.localeCompare(a.name))
          break
        case "newest":
          filtered.sort((a, b) => b._id.localeCompare(a._id))
          break
        case "oldest":
          filtered.sort((a, b) => a._id.localeCompare(b._id))
          break
      }
    }

    setFilteredSchools(filtered)
  }

  const campusOptions = CAMPUSES.map((campus) => ({
    value: campus,
    label: campus,
  }))

  useEffect(() => {
    applyFilters()
  }, [schools, filters])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-6xl mx-auto p-3 md:p-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Schools</CardTitle>
          <Link href="/schools/new">
            <Button>Add School</Button>
          </Link>
        </CardHeader>

        <CardContent>
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={schools.length}
            filteredCount={filteredSchools.length}
            showCampusFilter={true}
            showSortBy={true}
            searchPlaceholder="Search by school name..."
            campusOptions={campusOptions}
          />

          {filteredSchools.length === 0 ? (
            <p className="text-sm text-gray-600 mt-4">No schools found.</p>
          ) : (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.map((school) => (
                    <TableRow key={school._id}>
                      <TableCell className="font-semibold">
                        {school.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{school.campus || "—"}</Badge>
                      </TableCell>
                      <TableCell className="max-w-md truncate">
                        {school.description || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/schools/${school._id}`}>
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
  )
}

export default SchoolsPage
