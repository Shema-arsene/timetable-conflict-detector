"use client"

import { Fragment, useState, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Types
type SessionType = "day" | "evening" | "weekend"

type ModuleRow = {
  id: string
  title: string
  startTime: string
  endTime: string
  venue: string
  lecturer: string
}

type SchoolGroup = {
  id: string
  schoolName: string
  modules: ModuleRow[]
}

type NewTimetablePayload = {
  session: SessionType
  startDate: string
  endDate: string
  schools: SchoolGroup[]
}

// Helpers
const uid = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`

function timeToMinutes(t: string) {
  if (!t) return 0
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

// Conflict Detection
function detectConflictsFromGroups(schools: SchoolGroup[]) {
  const conflicts: string[] = []

  const roomIndex: Record<string, ModuleRow[]> = {}
  const lecturerIndex: Record<string, ModuleRow[]> = {}

  schools.forEach((school) => {
    school.modules.forEach((m) => {
      if (m.venue) {
        const k = m.venue.toLowerCase()
        roomIndex[k] = roomIndex[k] || []
        roomIndex[k].push(m)
      }

      if (m.lecturer) {
        const k = m.lecturer.toLowerCase()
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
            `Room conflict: "${room}" used by "${mods[i].title}" and "${mods[j].title}".`,
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

// Component
const NewTimetablePage = () => {
  const [session, setSession] = useState<SessionType>("day")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [schools, setSchools] = useState<SchoolGroup[]>([
    {
      id: uid("school"),
      schoolName: "School of Computing",
      modules: [
        {
          id: uid("m"),
          title: "",
          startTime: "08:30",
          endTime: "12:00",
          venue: "",
          lecturer: "",
        },
      ],
    },
  ])

  const [saveState, setSaveState] = useState<{
    saving: boolean
    error?: string
    success?: string
  }>({ saving: false })

  const conflicts = detectConflictsFromGroups(schools)

  /* ---------------- DATA ---------------- */

  const modules = ["", "Year 1", "Year 2", "Year 3"]
  const rooms = ["", "A101", "A102", "B201", "C301"]
  const lecturers = ["", "Dr. Smith", "Prof. Johnson", "Dr. Lee"]

  // Mutators

  const updateSchoolName = (id: string, name: string) =>
    setSchools((s) =>
      s.map((x) => (x.id === id ? { ...x, schoolName: name } : x)),
    )

  const addSchool = () =>
    setSchools((s) => [
      ...s,
      {
        id: uid("school"),
        schoolName: "New School",
        modules: [
          {
            id: uid("m"),
            title: "",
            startTime: "08:30",
            endTime: "12:00",
            venue: "",
            lecturer: "",
          },
        ],
      },
    ])

  const removeSchool = (id: string) =>
    setSchools((s) => s.filter((x) => x.id !== id))

  const addModuleRow = (schoolId: string) =>
    setSchools((s) =>
      s.map((x) =>
        x.id === schoolId
          ? {
              ...x,
              modules: [
                ...x.modules,
                {
                  id: uid("m"),
                  title: "",
                  startTime: "08:30",
                  endTime: "12:00",
                  venue: "",
                  lecturer: "",
                },
              ],
            }
          : x,
      ),
    )

  const removeModuleRow = (schoolId: string, moduleId: string) =>
    setSchools((s) =>
      s.map((x) =>
        x.id === schoolId
          ? { ...x, modules: x.modules.filter((m) => m.id !== moduleId) }
          : x,
      ),
    )

  const updateModuleField = (
    schoolId: string,
    moduleId: string,
    field: keyof ModuleRow,
    value: string,
  ) =>
    setSchools((s) =>
      s.map((x) =>
        x.id === schoolId
          ? {
              ...x,
              modules: x.modules.map((m) =>
                m.id === moduleId ? { ...m, [field]: value } : m,
              ),
            }
          : x,
      ),
    )

  // Save

  async function handleSave() {
    if (!startDate || !endDate) {
      setSaveState({ saving: false, error: "Dates are required." })
      return
    }

    if (conflicts.length) {
      setSaveState({
        saving: false,
        error: "Resolve timetable conflicts first.",
      })
      return
    }

    setSaveState({ saving: true })

    const payload: NewTimetablePayload = {
      session,
      startDate,
      endDate,
      schools,
    }

    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Save failed")

      setSaveState({ saving: false, success: "Timetable saved successfully." })
    } catch (err: any) {
      setSaveState({ saving: false, error: err.message })
    }
  }

  // UI

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center lg:justify-between mb-4">
          <h1 className="text-xl md:text-2xl font-bold whitespace-nowrap my-5">
            New Timetable
          </h1>
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
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setStartDate(e.target.value)
                }
              />
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <Label className="font-semibold text-lg">End</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setEndDate(e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {schools.map((school) => (
            <Card key={school.id} className="p-2">
              <CardHeader className="flex flex-col-reverse lg:flex-row lg:items-center justify-between max-lg:gap-5">
                <div className="flex items-center gap-3">
                  <Input
                    value={school.schoolName}
                    onChange={(e) =>
                      updateSchoolName(school.id, e.target.value)
                    }
                    className="w-52 sm:w-80"
                  />
                  <Badge>Modules: {school.modules.length}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => addModuleRow(school.id)}
                  >
                    Add Module
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => removeSchool(school.id)}
                  >
                    Remove School
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {school.modules.map((m) => (
                    <Fragment key={m.id}>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                        <div className="md:col-span-2">
                          <Label className="mx-1 my-2">Module Title</Label>
                          {/* <Input
                            value={m.title}
                            onChange={(e) =>
                              updateModuleField(
                                school.id,
                                m.id,
                                "title",
                                e.target.value
                              )
                            }
                          /> */}
                          <select
                            value={session}
                            onChange={(e) =>
                              updateModuleField(
                                school.id,
                                m.id,
                                "title",
                                e.target.value,
                              )
                            }
                            className="border rounded px-2 py-1"
                          >
                            {modules.map((module) => (
                              <option key={module} value={module}>
                                {module}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label className="mx-1 my-2">Start</Label>
                          <Input
                            type="time"
                            value={m.startTime}
                            onChange={(e) =>
                              updateModuleField(
                                school.id,
                                m.id,
                                "startTime",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label className="mx-1 my-2">End</Label>
                          <Input
                            type="time"
                            value={m.endTime}
                            onChange={(e) =>
                              updateModuleField(
                                school.id,
                                m.id,
                                "endTime",
                                e.target.value,
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label className="mx-1 my-2">Venue</Label>
                          {/* <Input
                            value={m.venue}
                            onChange={(e) =>
                              updateModuleField(
                                school.id,
                                m.id,
                                "venue",
                                e.target.value
                              )
                            }
                          /> */}
                          <select
                            value={rooms}
                            onChange={(e) =>
                              updateModuleField(
                                school.id,
                                m.id,
                                "venue",
                                e.target.value,
                              )
                            }
                            className="border rounded px-2 py-1"
                          >
                            {rooms.map((room) => (
                              <option key={room} value={room}>
                                {room}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label className="mx-1 my-2">Lecturer</Label>
                          {/* <Input
                            value={m.lecturer}
                            onChange={(e) =>
                              updateModuleField(
                                school.id,
                                m.id,
                                "lecturer",
                                e.target.value
                              )
                            }
                          /> */}
                          <select
                            value={lecturers}
                            onChange={(e) =>
                              updateModuleField(
                                school.id,
                                m.id,
                                "lecturer",
                                e.target.value,
                              )
                            }
                            className="border rounded px-2 py-1"
                          >
                            {lecturers.map((lecturer) => (
                              <option key={lecturer} value={lecturer}>
                                {lecturer}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="destructive"
                            onClick={() => removeModuleRow(school.id, m.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      {/* quick inline conflict hint for this row */}
                      <div className="text-xs text-yellow-700 mt-1">
                        {/* warn if start >= end */}
                        {m.startTime &&
                          m.endTime &&
                          timeToMinutes(m.startTime) >=
                            timeToMinutes(m.endTime) && (
                            <div>
                              Invalid time range: start should be before end.
                            </div>
                          )}
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

              {saveState.error && (
                <div className="text-sm text-red-600 mb-2">
                  {saveState.error}
                </div>
              )}
              {saveState.success && (
                <div className="text-sm text-green-600 mb-2">
                  {saveState.success}
                </div>
              )}

              <Button
                onClick={handleSave}
                disabled={saveState.saving}
                className="ml-2"
              >
                {saveState.saving ? "Saving..." : "Save Timetable"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewTimetablePage
