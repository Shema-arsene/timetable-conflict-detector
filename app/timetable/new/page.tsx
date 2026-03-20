"use client"

import { Fragment, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { CAMPUSES } from "@/constants/campus"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { validateTimetableDates } from "@/lib/dateValidation"

// Types
type SessionType = "day" | "evening" | "weekend"

type ModuleRow = {
  id: string
  moduleId: string
  startTime: string
  endTime: string
  roomId: string
  lecturerId: string
  campus: "Kacyiru" | "Remera"
}

type SchoolGroup = {
  id: string
  schoolId: string
  modules: ModuleRow[]
}

type CreateTimetablePayload = {
  title: string
  session: SessionType
  startDate: string
  endDate: string
  entries: {
    schoolId: string
    moduleId: string
    lecturerId: string
    roomId: string
    campus: "Kacyiru" | "Remera"
    startTime: string
    endTime: string
  }[]
}

// Helpers
const uid = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`

function timeToMinutes(t: string) {
  if (!t) return 0
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

function isStartTimeInFuture(startDate: string, startTime: string) {
  if (!startDate || !startTime) return true
  const start = new Date(`${startDate}T${startTime}`)
  const now = new Date()
  return start.getTime() > now.getTime()
}

// Conflict Detection
function detectConflictsFromGroups(
  schools: SchoolGroup[],
  modulesList: any[],
  roomsList: any[],
  lecturersList: any[],
) {
  const conflicts: string[] = []
  const roomIndex: Record<string, ModuleRow[]> = {}
  const lecturerIndex: Record<string, ModuleRow[]> = {}

  schools.forEach((school) => {
    school.modules.forEach((m) => {
      const roomName = roomsList.find((r) => r._id === m.roomId)?.name
      const lecturerName =
        lecturersList.find((l) => l._id === m.lecturerId)?.firstName +
        " " +
        lecturersList.find((l) => l._id === m.lecturerId)?.lastName

      if (roomName) {
        const k = roomName.toLowerCase()
        roomIndex[k] = roomIndex[k] || []
        roomIndex[k].push(m)
      }

      if (lecturerName) {
        const k = lecturerName.toLowerCase()
        lecturerIndex[k] = lecturerIndex[k] || []
        lecturerIndex[k].push(m)
      }
    })
  })

  const checkOverlap = (a: ModuleRow, b: ModuleRow) =>
    Math.max(timeToMinutes(a.startTime), timeToMinutes(b.startTime)) <
    Math.min(timeToMinutes(a.endTime), timeToMinutes(b.endTime))

  Object.entries(roomIndex).forEach(([room, mods]) => {
    for (let i = 0; i < mods.length; i++) {
      for (let j = i + 1; j < mods.length; j++) {
        if (checkOverlap(mods[i], mods[j])) {
          conflicts.push(
            `Room conflict: "${room}" used by overlapping modules.`,
          )
        }
      }
    }
  })

  Object.entries(lecturerIndex).forEach(([lect, mods]) => {
    for (let i = 0; i < mods.length; i++) {
      for (let j = i + 1; j < mods.length; j++) {
        if (checkOverlap(mods[i], mods[j])) {
          conflicts.push(
            `Lecturer conflict: "${lect}" assigned to overlapping modules.`,
          )
        }
      }
    }
  })

  return conflicts
}

const API_URL = process.env.NEXT_PUBLIC_API_URL

const NewTimetablePage = () => {
  const router = useRouter()

  // API data
  const [schoolsList, setSchoolsList] = useState<any[]>([])
  const [modulesList, setModulesList] = useState<any[]>([])
  const [roomsList, setRoomsList] = useState<any[]>([])
  const [lecturersList, setLecturersList] = useState<any[]>([])
  const [timetableHeading, setTimetableHeading] = useState("")

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/api/schools`),
      axios.get(`${API_URL}/api/modules`),
      axios.get(`${API_URL}/api/rooms`),
      axios.get(`${API_URL}/api/lecturers`),
    ]).then(([schools, modules, rooms, lecturers]) => {
      setSchoolsList(schools.data)
      setModulesList(modules.data)
      setRoomsList(rooms.data)
      setLecturersList(lecturers.data)
    })
  }, [])

  // Local state
  const [session, setSession] = useState<SessionType>("day")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [schools, setSchools] = useState<SchoolGroup[]>([
    {
      id: uid("school"),
      schoolId: "",
      modules: [
        {
          id: uid("m"),
          moduleId: "",
          startTime: "00:00", // Changed to 00:00
          endTime: "00:00", // Changed to 00:00
          roomId: "",
          lecturerId: "",
          campus: "Kacyiru",
        },
      ],
    },
  ])

  const [saving, setSaving] = useState(false)

  const conflicts = detectConflictsFromGroups(
    schools,
    modulesList,
    roomsList,
    lecturersList,
  )

  // Mutators
  const updateSchoolField = (
    id: string,
    field: keyof SchoolGroup,
    value: string,
  ) =>
    setSchools((s) =>
      s.map((sch) => (sch.id === id ? { ...sch, [field]: value } : sch)),
    )

  const addSchool = () =>
    setSchools((s) => [
      ...s,
      {
        id: uid("school"),
        schoolId: "",
        modules: [
          {
            id: uid("m"),
            moduleId: "",
            startTime: "00:00", // Changed to 00:00
            endTime: "00:00", // Changed to 00:00
            roomId: "",
            lecturerId: "",
            campus: "Kacyiru",
          },
        ],
      },
    ])

  const removeSchool = (id: string) =>
    setSchools((s) => s.filter((sch) => sch.id !== id))

  const addModuleRow = (schoolId: string) =>
    setSchools((s) =>
      s.map((sch) =>
        sch.id === schoolId
          ? {
              ...sch,
              modules: [
                ...sch.modules,
                {
                  id: uid("m"),
                  moduleId: "",
                  startTime: "00:00",
                  endTime: "00:00",
                  roomId: "",
                  lecturerId: "",
                  campus: "Kacyiru",
                },
              ],
            }
          : sch,
      ),
    )

  const removeModuleRow = (schoolId: string, moduleId: string) =>
    setSchools((s) =>
      s.map((sch) =>
        sch.id === schoolId
          ? { ...sch, modules: sch.modules.filter((m) => m.id !== moduleId) }
          : sch,
      ),
    )

  const updateModuleField = (
    schoolId: string,
    moduleId: string,
    field: keyof ModuleRow,
    value: string,
  ) =>
    setSchools((s) =>
      s.map((sch) =>
        sch.id === schoolId
          ? {
              ...sch,
              modules: sch.modules.map((m) =>
                m.id === moduleId ? { ...m, [field]: value } : m,
              ),
            }
          : sch,
      ),
    )

  const hasPastStartTime = schools.some((school) =>
    school.modules.some(
      (m) =>
        m.startTime &&
        m.startTime !== "00:00" &&
        !isStartTimeInFuture(startDate, m.startTime),
    ),
  )

  useEffect(() => {
    if (hasPastStartTime) {
      toast.error("Error creating timetable", {
        description: "One or more modules start in the past.",
      })

      setSaving(false)
    }
  }, [hasPastStartTime])

  const handleSave = async () => {
    if (!startDate || !endDate) {
      toast.error("Error creating timetable", {
        description: "Start and end dates are required.",
      })
      setSaving(false)
      return
    }

    const dateValidation = validateTimetableDates(startDate, endDate)
    if (!dateValidation.valid) {
      toast.error("Error creating timetable", {
        description: dateValidation.message!,
      })
      setSaving(false)
      return
    }

    if (!timetableHeading || timetableHeading.trim() === "") {
      toast.error("Error creating timetable", {
        description: "Timetable title is required.",
      })
      setSaving(false)
      return
    }

    if (conflicts.length) {
      toast.error("Error creating timetable", {
        description: "Please resolve all conflicts before saving.",
      })
      setSaving(false)
      return
    }

    setSaving(true) // Do I need this state?

    // Transforming nested schools into flat entries array
    const entries = schools.flatMap((school) =>
      school.modules.map((module) => ({
        schoolId: school.schoolId,
        moduleId: module.moduleId,
        lecturerId: module.lecturerId,
        roomId: module.roomId,
        campus: module.campus,
        startTime: module.startTime,
        endTime: module.endTime,
      })),
    )

    // Filter out any incomplete entries (ignore entries with default 00:00 times if other fields are empty)
    const validEntries = entries.filter((entry) => {
      // Check if this is a real entry (not just a placeholder)
      const hasRequiredFields =
        entry.schoolId &&
        entry.schoolId.trim() !== "" &&
        entry.moduleId &&
        entry.moduleId.trim() !== "" &&
        entry.lecturerId &&
        entry.lecturerId.trim() !== "" &&
        entry.roomId &&
        entry.roomId.trim() !== ""

      // Also check if times are set (not both 00:00)
      const hasValidTimes =
        entry.startTime !== "00:00" || entry.endTime !== "00:00"

      return hasRequiredFields && hasValidTimes
    })

    if (validEntries.length === 0) {
      toast.error("Error creating the timetable.", {
        description:
          "Please select a school, module, lecturer, room, and set valid times for at least one entry.",
      })
      setSaving(false)
      return
    }

    const payload = {
      title: timetableHeading,
      session,
      startDate,
      endDate,
      entries: validEntries,
    }

    try {
      const res = await axios.post(`${API_URL}/api/timetables`, payload)
      toast.success("Yaay!", { description: "Timetable created successfully!" })
      setTimeout(() => router.push("/timetable"), 3000)
    } catch (err: any) {
      console.error("Save error:", err.response?.data || err.message)
      toast.error("Error creating timetable", {
        description:
          err.response?.data?.message || "Failed to create timetable",
      })
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-5 text-xl md:text-2xl font-bold">
        Create a New Timetable
      </h1>
      <Card className="p-3 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-start mb-4">
            <div className="w-full text-xl md:text-2xl font-semibold my-5 uppercase">
              <Input
                type="text"
                value={timetableHeading}
                onChange={(e) => setTimetableHeading(e.target.value)}
                placeholder="Timetable Title - Module One Teaching Timetable Extract SEPT 2026 - DEC 2026"
                className="w-full"
              />
            </div>
            <div className="flex flex-col lg:flex-row items-start gap-5">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <Label className="font-semibold text-lg">Session</Label>
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value as SessionType)}
                  className="border rounded px-2 py-1"
                >
                  <option value="day">Day (Morning & Afternoon)</option>
                  <option value="evening">Evening</option>
                  <option value="weekend">Weekend (Morning & Afternoon)</option>
                </select>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <Label className="font-semibold text-lg">Start</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                <Label className="font-semibold text-lg">End</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {startDate && endDate && (
                <div className="flex items-center gap-2 my-2">
                  <Badge
                    variant="outline"
                    className={`
                        ${(() => {
                          const diffDays = Math.ceil(
                            (new Date(endDate).getTime() -
                              new Date(startDate).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )
                          const weeks = diffDays / 7
                          if (weeks >= 3 && weeks <= 4)
                            return "bg-green-100 text-green-800"
                          if (weeks < 3) return "bg-yellow-100 text-yellow-800"
                          return "bg-red-100 text-red-800"
                        })()}`}
                  >
                    {(() => {
                      const diffDays = Math.ceil(
                        (new Date(endDate).getTime() -
                          new Date(startDate).getTime()) /
                          (1000 * 60 * 60 * 24),
                      )
                      const weeks = diffDays / 7
                      return `${weeks.toFixed(1)} weeks`
                    })()}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Schools */}
          <div className="space-y-4">
            {schools.map((sch) => (
              <Card key={sch.id} className="p-2">
                <CardHeader className="flex flex-col-reverse lg:flex-row lg:items-center justify-between max-lg:gap-5">
                  <div className="flex items-center gap-3">
                    <select
                      value={sch.schoolId}
                      onChange={(e) =>
                        updateSchoolField(sch.id, "schoolId", e.target.value)
                      }
                      className="w-52 sm:w-80 border rounded px-2 py-1"
                    >
                      <option value="" disabled>
                        -- Select School --
                      </option>
                      {schoolsList.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <Badge>Modules: {sch.modules.length}</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => addModuleRow(sch.id)}
                    >
                      Add Module
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => removeSchool(sch.id)}
                    >
                      Remove School
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {sch.modules.map((module) => (
                      <Fragment key={module.id}>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                          <div className="md:col-span-2">
                            <Label className="mx-1 my-2">Module</Label>
                            <select
                              value={module.moduleId}
                              onChange={(e) =>
                                updateModuleField(
                                  sch.id,
                                  module.id,
                                  "moduleId",
                                  e.target.value,
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                            >
                              <option value="" disabled>
                                -- Select Module --
                              </option>
                              {modulesList.map((mod) => (
                                <option key={mod._id} value={mod._id}>
                                  {mod.code} {mod.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <Label className="mx-1 my-2">Campus</Label>
                            <select
                              value={module.campus}
                              onChange={(e) =>
                                updateModuleField(
                                  sch.id,
                                  module.id,
                                  "campus",
                                  e.target.value,
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                            >
                              <option value="" disabled>
                                -- Select Campus --
                              </option>
                              {CAMPUSES.map((campus) => (
                                <option key={campus} value={campus}>
                                  {campus}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <Label className="mx-1 my-2">Start</Label>
                            <Input
                              type="time"
                              value={module.startTime}
                              onChange={(e) =>
                                updateModuleField(
                                  sch.id,
                                  module.id,
                                  "startTime",
                                  e.target.value,
                                )
                              }
                              className="w-full"
                              step="60"
                            />
                          </div>

                          <div>
                            <Label className="mx-1 my-2">End</Label>
                            <Input
                              type="time"
                              value={module.endTime}
                              onChange={(e) =>
                                updateModuleField(
                                  sch.id,
                                  module.id,
                                  "endTime",
                                  e.target.value,
                                )
                              }
                              className="w-full"
                              step="60"
                            />
                          </div>

                          <div>
                            <Label className="mx-1 my-2">Room</Label>
                            <select
                              value={module.roomId}
                              onChange={(e) =>
                                updateModuleField(
                                  sch.id,
                                  module.id,
                                  "roomId",
                                  e.target.value,
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                            >
                              <option value="" disabled>
                                -- Select Room --
                              </option>
                              {roomsList
                                .filter((room) => room.campus === module.campus)
                                .map((r) => (
                                  <option key={r._id} value={r._id}>
                                    {r.name} (Cap: {r.capacity})
                                  </option>
                                ))}
                            </select>
                          </div>

                          <div>
                            <Label className="mx-1 my-2">Lecturer</Label>
                            <select
                              value={module.lecturerId}
                              onChange={(e) =>
                                updateModuleField(
                                  sch.id,
                                  module.id,
                                  "lecturerId",
                                  e.target.value,
                                )
                              }
                              className="border rounded px-2 py-1 w-full"
                            >
                              <option value="" disabled>
                                -- Select Lecturer --
                              </option>
                              {lecturersList.map((lecturer) => (
                                <option key={lecturer._id} value={lecturer._id}>
                                  {lecturer.firstName} {lecturer.lastName}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeModuleRow(sch.id, module.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex gap-2">
              <Button onClick={addSchool}>Add School</Button>
              <div className="flex-1" />
              <div className="text-right">
                {conflicts.length > 0 && (
                  <div className="mb-2 text-sm text-red-700">
                    <strong>Conflicts detected:</strong>
                    <ul className="list-disc list-inside">
                      {conflicts.slice(0, 6).map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* <Button onClick={handleSave} disabled={saving} className="ml-2">
                  {saving ? "Saving..." : "Save Timetable"}
                </Button> */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/timetable")}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving || conflicts.length > 0}
                  >
                    {saving ? "Creating..." : "Create Timetable"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default NewTimetablePage
