"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, Calendar, DoorOpen, BookOpen, Users, Building2, PlusCircle } from "lucide-react"
import Link from "next/link"

type EmptyStateProps = {
  type: "timetables" | "lecturers" | "rooms" | "modules" | "schools"
  onAction?: () => void
}

const emptyStateConfig = {
  timetables: {
    icon: Calendar,
    title: "No timetables found",
    description: "Create your first timetable to get started",
    buttonText: "Create Timetable",
    buttonLink: "/timetable/new",
  },
  lecturers: {
    icon: Users,
    title: "No lecturers found",
    description: "Add lecturers to assign them to modules and timetables",
    buttonText: "Add Lecturer",
    buttonLink: "/lecturers/new",
  },
  rooms: {
    icon: DoorOpen,
    title: "No rooms found",
    description: "Add rooms to schedule classes and exams",
    buttonText: "Add Room",
    buttonLink: "/rooms/new",
  },
  modules: {
    icon: BookOpen,
    title: "No modules found",
    description: "Create modules to build your timetables",
    buttonText: "Add Module",
    buttonLink: "/modules/new",
  },
  schools: {
    icon: Building2,
    title: "No schools found",
    description: "Add schools to organize modules by department",
    buttonText: "Add School",
    buttonLink: "/schools/new",
  },
}

export function EmptyState({ type }: EmptyStateProps) {
  const config = emptyStateConfig[type]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-gray-100 p-4 mb-4">
        <Icon className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {config.title}
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        {config.description}
      </p>
      <Link href={config.buttonLink}>
        <Button>
          <PlusCircle className="h-4 w-4 mr-2" />
          {config.buttonText}
        </Button>
      </Link>
    </div>
  )
}