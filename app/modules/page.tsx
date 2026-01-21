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

export interface Module {
  _id: string
  code: string
  name: string
  campus: string
}

const ModulesPage = () => {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchModules() {
      try {
        const res = await fetch("/api/modules")
        const data = await res.json()
        setModules(data)
      } catch (error) {
        console.error("Failed to fetch modules", error)
      } finally {
        setLoading(false)
      }
    }

    fetchModules()
  }, [])

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

      <Card>
        <CardHeader>
          <CardTitle>All Modules</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading modules...</p>
          ) : modules.length === 0 ? (
            <p className="text-sm text-muted-foreground">No modules found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Campus</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((module) => (
                  <TableRow key={module._id}>
                    <TableCell>{module.code}</TableCell>
                    <TableCell>{module.name}</TableCell>
                    <TableCell>{module.campus}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/modules/${module._id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

export default ModulesPage
