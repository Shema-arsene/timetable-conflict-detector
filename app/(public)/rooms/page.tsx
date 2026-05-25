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
import { FilterBar, FilterOptions } from "@/components/FilterBar"
import { Badge } from "@/components/ui/badge"
import { CAMPUSES } from "@/constants/campus"
import { EmptyState } from "@/components/EmptyState"

type Room = {
  _id: string
  name: string
  campus: string
  capacity: number
}

const RoomsPage = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    campus: "all",
    sortBy: "name-asc",
  })

  const fetchRooms = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/rooms`,
      )
      setRooms(res.data)
    } catch (err) {
      setError("Failed to fetch rooms")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  const applyFilters = () => {
    let filtered = [...rooms]

    // Filter by search (room name)
    if (filters.search) {
      filtered = filtered.filter((room) =>
        room.name.toLowerCase().includes(filters.search!.toLowerCase()),
      )
    }

    // Filter by campus
    if (filters.campus && filters.campus !== "all") {
      filtered = filtered.filter((room) => room.campus === filters.campus)
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
          // For rooms, newest means highest capacity
          filtered.sort((a, b) => b.capacity - a.capacity)
          break
        case "oldest":
          filtered.sort((a, b) => a.capacity - b.capacity)
          break
      }
    }

    setFilteredRooms(filtered)
  }

  const campusOptions = CAMPUSES.map((campus) => ({
    value: campus,
    label: campus,
  }))

  useEffect(() => {
    applyFilters()
  }, [rooms, filters])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-6xl mx-auto p-3 md:p-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Rooms</CardTitle>
          <Link href="/rooms/new">
            <Button>Add Room</Button>
          </Link>
        </CardHeader>

        <CardContent>
          <FilterBar
            filters={filters}
            onFiltersChange={setFilters}
            totalCount={rooms.length}
            filteredCount={filteredRooms.length}
            showCampusFilter={true}
            showSortBy={true}
            searchPlaceholder="Search by room name..."
            campusOptions={campusOptions}
          />

          {!loading && filteredRooms.length === 0 ? (
            <EmptyState type="rooms" />
          ) : (
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Campus</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room._id}>
                      <TableCell className="font-semibold">
                        {room.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{room.campus}</Badge>
                      </TableCell>
                      <TableCell>{room.capacity}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/rooms/${room._id}`}>
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

export default RoomsPage
