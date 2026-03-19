"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Calendar,
  Users,
  DoorOpen,
  BookOpen,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  PlusCircle,
} from "lucide-react"
import axios from "axios"
import { toast } from "sonner"

const API_URL = process.env.NEXT_PUBLIC_API_URL

type DashboardStats = {
  totalTimetables: number
  totalConflicts: number
  totalLecturers: number
  totalRooms: number
  totalModules: number
  totalSchools: number
  upcomingTimetables: number
}

type Conflict = {
  id: string
  message: string
  time: string
  severity: "high" | "medium" | "low"
  type: string
  resolved?: boolean
}

type Timetable = {
  _id: string
  title: string
  session: string
  startDate: string
  endDate: string
  entries: any[]
  createdAt: string
}

// Simple date formatter without date-fns
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

const formatShortDate = (dateString: string) => {
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
  return `${months[date.getMonth()]} ${date.getDate()}`
}

const formatDistanceToNow = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return formatDate(dateString)
}

const HomePage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalTimetables: 0,
    totalConflicts: 0,
    totalLecturers: 0,
    totalRooms: 0,
    totalModules: 0,
    totalSchools: 0,
    upcomingTimetables: 0,
  })

  const [recentTimetables, setRecentTimetables] = useState<Timetable[]>([])
  const [recentConflicts, setRecentConflicts] = useState<Conflict[]>([])
  const [showResolvedConflicts, setShowResolvedConflicts] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [timetablesRes, lecturersRes, roomsRes, modulesRes, schoolsRes] =
        await Promise.all([
          axios.get(`${API_URL}/api/timetables`),
          axios.get(`${API_URL}/api/lecturers`),
          axios.get(`${API_URL}/api/rooms`),
          axios.get(`${API_URL}/api/modules`),
          axios.get(`${API_URL}/api/schools`),
        ])

      const timetables = timetablesRes.data
      const now = new Date()

      // Calculate stats
      const upcomingCount = timetables.filter(
        (t: Timetable) => new Date(t.startDate) > now,
      ).length

      // Generate conflicts from timetables
      const generatedConflicts = generateConflictsFromTimetables(timetables)

      setStats({
        totalTimetables: timetables.length,
        totalConflicts: generatedConflicts.length,
        totalLecturers: lecturersRes.data.length,
        totalRooms: roomsRes.data.length,
        totalModules: modulesRes.data.length,
        totalSchools: schoolsRes.data.length,
        upcomingTimetables: upcomingCount,
      })

      setRecentTimetables(timetables.slice(0, 5))
      setRecentConflicts(generatedConflicts.slice(0, 5))
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const generateConflictsFromTimetables = (
    timetables: Timetable[],
  ): Conflict[] => {
    const conflicts: Conflict[] = []

    timetables.forEach((timetable) => {
      // Room conflicts
      const roomMap = new Map()
      timetable.entries.forEach((entry) => {
        const key = `${entry.roomId?._id}-${entry.startTime}`
        if (roomMap.has(key)) {
          conflicts.push({
            id: `conflict-${Math.random()}`,
            message: `Room ${entry.roomId?.name} has overlapping sessions in ${timetable.title}`,
            time: formatDistanceToNow(timetable.createdAt),
            severity: "high",
            type: "room",
          })
        }
        roomMap.set(key, true)
      })

      // Lecturer conflicts
      const lecturerMap = new Map()
      timetable.entries.forEach((entry) => {
        const key = `${entry.lecturerId?._id}-${entry.startTime}`
        if (lecturerMap.has(key)) {
          conflicts.push({
            id: `conflict-${Math.random()}`,
            message: `${entry.lecturerId?.firstName} ${entry.lecturerId?.lastName} has overlapping sessions in ${timetable.title}`,
            time: formatDistanceToNow(timetable.createdAt),
            severity: "medium",
            type: "lecturer",
          })
        }
        lecturerMap.set(key, true)
      })
    })

    return conflicts.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 }
      return severityOrder[a.severity] - severityOrder[b.severity]
    })
  }

  const resolveConflict = (conflictId: string) => {
    setRecentConflicts((prev) => prev.filter((c) => c.id !== conflictId))
    setStats((prev) => ({ ...prev, totalConflicts: prev.totalConflicts - 1 }))
    toast.success("Conflict marked as resolved")
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSessionBadgeColor = (session: string) => {
    switch (session) {
      case "day":
        return "bg-green-100 text-green-800"
      case "evening":
        return "bg-purple-100 text-purple-800"
      case "weekend":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      label: "Total Timetables",
      value: stats.totalTimetables,
      icon: Calendar,
      color: "bg-blue-500",
      link: "/timetable",
      hint: `${stats.upcomingTimetables} upcoming`,
    },
    {
      label: "Active Conflicts",
      value: stats.totalConflicts,
      icon: AlertTriangle,
      color: "bg-red-500",
      link: "/timetable?conflicts=true",
      hint: "Needs attention",
    },
    {
      label: "Lecturers",
      value: stats.totalLecturers,
      icon: Users,
      color: "bg-green-500",
      link: "/lecturers",
    },
    {
      label: "Rooms",
      value: stats.totalRooms,
      icon: DoorOpen,
      color: "bg-purple-500",
      link: "/rooms",
    },
    {
      label: "Modules",
      value: stats.totalModules,
      icon: BookOpen,
      color: "bg-yellow-500",
      link: "/modules",
    },
    {
      label: "Schools",
      value: stats.totalSchools,
      icon: TrendingUp,
      color: "bg-indigo-500",
      link: "/schools",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-2">
              Welcome back! Here's what's happening with your timetables.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/timetable")}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              View All
            </Button>
            <Link href="/timetable/new">
              <Button className="gap-2">
                <PlusCircle className="w-4 h-4" />
                Create Timetable
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {statCards.map((stat) => (
            <Link href={stat.link} key={stat.label}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer p-0">
                <CardContent className="p-4">
                  <div>
                    <div className="w-full flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-600">
                        {stat.label}
                      </p>
                      <div className={`${stat.color} p-1 rounded-lg`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold mt-2 ml-3">{stat.value}</p>
                    {stat.hint && (
                      <p className="text-xs text-gray-500 mt-1">{stat.hint}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Timetables */}
          <div className="lg:col-span-2">
            <Card className="p-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Timetables</CardTitle>
                <Link href="/timetable">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View all <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentTimetables.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No timetables yet</p>
                    <Link href="/timetable/new">
                      <Button variant="link" className="mt-2">
                        Create your first timetable
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentTimetables.map((timetable) => (
                      <Link
                        href={`/timetable/${timetable._id}`}
                        key={timetable._id}
                      >
                        <div className="flex items-center justify-between p-3 m-3 rounded-lg hover:bg-gray-50 transition-colors border">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {timetable.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge
                                className={getSessionBadgeColor(
                                  timetable.session,
                                )}
                              >
                                {timetable.session}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatShortDate(timetable.startDate)} -{" "}
                                {formatShortDate(timetable.endDate)}
                              </span>
                              <Badge variant="outline">
                                {timetable.entries.length} entries
                              </Badge>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Conflicts */}
          <div>
            <Card className="px-3 py-5">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Recent Conflicts
                </CardTitle>
                {recentConflicts.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setShowResolvedConflicts(!showResolvedConflicts)
                    }
                  >
                    {showResolvedConflicts ? "Hide resolved" : "Show resolved"}
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {recentConflicts.length === 0 ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">All clear!</p>
                    <p className="text-sm text-gray-500 mt-1">
                      No conflicts detected
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentConflicts.map((conflict) => (
                      <div
                        key={conflict.id}
                        className={`p-3 rounded-lg border ${getSeverityColor(conflict.severity)}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {conflict.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                {conflict.type}
                              </Badge>
                              <span className="text-xs opacity-75">
                                {conflict.time}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              resolveConflict(conflict.id)
                            }}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6 px-3 py-5">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 flex flex-col items-center gap-2">
                <Link href="/rooms/new" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <DoorOpen className="w-4 h-4 mr-2" />
                    Add New Room
                  </Button>
                </Link>
                <Link href="/lecturers/new" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Add New Lecturer
                  </Button>
                </Link>
                <Link href="/modules/new" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Add New Module
                  </Button>
                </Link>
                <Link href="/schools/new" className="w-full">
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Add New School
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
