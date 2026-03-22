"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Pencil } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { FilterBar, FilterOptions } from "@/components/FilterBar"
import { Badge } from "@/components/ui/badge"

interface School {
  _id: string
  name: string
}

interface PopulatedSchool {
  _id: string
  name: string
  campus: string
}

export interface Module {
  _id: string
  code: string
  name: string
  school: PopulatedSchool
}

const ModulesPage = () => {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [schools, setSchools] = useState<School[]>([])
  const [filteredModules, setFilteredModules] = useState<Module[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    sortBy: "name-asc",
  })

  const fetchModules = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/modules`,
      )
      const data = await res.data
      setModules(data)
    } catch (error) {
      console.error("Failed to fetch modules", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSchools = async () => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/schools`)
      .then((res) => setSchools(res.data))
  }

  const applyFilters = () => {
    let filtered = [...modules]

    // Filter by search (module name or code)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (module) =>
          module.name.toLowerCase().includes(searchLower) ||
          module.code.toLowerCase().includes(searchLower),
      )
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
        case "code-asc":
          filtered.sort((a, b) => a.code.localeCompare(b.code))
          break
        case "code-desc":
          filtered.sort((a, b) => b.code.localeCompare(a.code))
          break
      }
    }

    setFilteredModules(filtered)
  }

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "code-asc", label: "Code (A-Z)" },
    { value: "code-desc", label: "Code (Z-A)" },
  ]

  useEffect(() => {
    fetchSchools()
  }, [])

  useEffect(() => {
    fetchModules()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [modules, filters])

  return (
    <section className="min-h-screen p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Modules</h1>
        <Button asChild>
          <Link href="/modules/new">
            <Plus className="mr-2 h-4 w-4" /> Add Module
          </Link>
        </Button>
      </div>

      <Card className="p-3 md:p-6">
        <CardHeader>
          <CardTitle>All Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={modules.length}
            filteredCount={filteredModules.length}
            showSessionFilter={false}
            showCampusFilter={false}
            showSortBy={true}
            searchPlaceholder="Search by module name or code..."
            sortOptions={sortOptions}
          />

          {filteredModules.length === 0 ? (
            <p className="text-sm text-gray-600 mt-4">No modules found.</p>
          ) : (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Module Name</TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.map((module) => (
                    <TableRow key={module._id}>
                      <TableCell className="font-mono font-semibold">
                        {module.code}
                      </TableCell>
                      <TableCell>{module.name}</TableCell>
                      <TableCell>{module.school?.name || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {module.school?.campus || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/modules/${module._id}`}>
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
    </section>
  )
}

export default ModulesPage
