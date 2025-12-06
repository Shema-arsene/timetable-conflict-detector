import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const TimetablePage = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Your Timetables</h1>
        <Link href="/timetable/new">
          <Button>Create New</Button>
        </Link>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>All Timetables</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            List all generated timetables here (table view coming soon).
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TimetablePage
