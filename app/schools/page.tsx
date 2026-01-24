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

  useEffect(() => {
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

    fetchSchools()
  }, [])

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
          {loading && <p>Loading schools...</p>}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && schools.length === 0 && (
            <p className="text-sm text-gray-600">
              No schools found. Create one to get started.
            </p>
          )}

          {!loading && schools.length > 0 && (
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
                {schools.map((school) => (
                  <TableRow key={school._id}>
                    <TableCell className="font-semibold">
                      {school.name}
                    </TableCell>
                    <TableCell>{school.campus}</TableCell>
                    <TableCell>{school.description}</TableCell>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default SchoolsPage
