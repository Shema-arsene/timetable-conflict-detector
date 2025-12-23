import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar } from "@/components/ui/avatar"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"

type Stat = { label: string; value: number; hint?: string }

const stats: Stat[] = [
  { label: "Timetables", value: 12 },
  { label: "Detected Conflicts", value: 3 },
  { label: "Lecturers", value: 28 },
  { label: "Rooms", value: 14 },
]

const recentConflicts = [
  {
    id: "c1",
    message: "Room A101 has two modules in Weekday Morning",
    time: "2h ago",
    severity: "high",
  },
  {
    id: "c2",
    message: "Dr. K. assigned to Year2-CS & Year3-IT in Afternoon",
    time: "1d ago",
    severity: "medium",
  },
  {
    id: "c3",
    message: "Room B201 capacity exceeded for Year1-Eng",
    time: "3d ago",
    severity: "low",
  },
]

const timetablePreview = [
  {
    className: "Year 2 - CS",
    morning: "CS201 - A101",
    afternoon: "CS202 - A102",
    evening: "",
    weekend: "",
  },
  {
    className: "Year 3 - IT",
    morning: "IT301 - B101",
    afternoon: "IT302 - B102",
    evening: "IT303 - B103",
    weekend: "",
  },
  {
    className: "Year 1 - Eng",
    morning: "ENG101 - C101",
    afternoon: "ENG102 - C101",
    evening: "",
    weekend: "ENG103 - C102",
  },
]

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-semibold">Dashboard</h2>
            <p className="text-sm text-gray-600 mt-1">
              Overview of timetables, rooms and detected conflicts.
            </p>
          </div>

          <Link href="/timetable/new">
            <Button>Create Timetable</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <Card key={s.label} className="p-4">
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {s.label}
                    </p>
                    <p className="text-2xl font-semibold mt-2">{s.value}</p>
                    {s.hint && (
                      <p className="text-xs text-gray-400 mt-1">{s.hint}</p>
                    )}
                  </div>
                  <div>
                    <Avatar className="w-10 h-10 flex items-center justify-center border-2 border-gray-200 bg-gray-50">
                      {s.label.charAt(0)}
                    </Avatar>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main grid: timetable preview + recent conflicts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="py-5 px-3">
              <CardHeader>
                <CardTitle>Recent Timetables</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Morning</TableHead>
                      <TableHead>Afternoon</TableHead>
                      <TableHead>Evening</TableHead>
                      <TableHead>Weekend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timetablePreview.map((row) => (
                      <TableRow key={row.className}>
                        <TableCell className="font-medium">
                          {row.className}
                        </TableCell>
                        <TableCell>{row.morning}</TableCell>
                        <TableCell>{row.afternoon}</TableCell>
                        <TableCell>
                          {row.evening || (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {row.weekend || (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 flex gap-2">
                  <Badge>Morning</Badge>
                  <Badge>Afternoon</Badge>
                  <Badge>Evening</Badge>
                  <Badge>Weekend</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="py-5 px-3">
              <CardHeader>
                <CardTitle>Recent Conflicts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentConflicts.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-start justify-between p-2 rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`shrink-0 w-3 h-3 rounded-full mt-2 ${
                            c.severity === "high"
                              ? "bg-red-500"
                              : c.severity === "medium"
                              ? "bg-yellow-400"
                              : "bg-green-400"
                          }`}
                        />
                        <div>
                          <p className="text-sm">{c.message}</p>
                          <p className="text-xs text-gray-400">{c.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-center">
                  <Link href="/conflicts">
                    <Button variant="link">See all conflicts</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 py-5 px-3">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Button variant="outline">
                  <Link href="/rooms">Manage Rooms</Link>
                </Button>
                <Button variant="outline">
                  <Link href="/lecturers">Manage Lecturers</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
