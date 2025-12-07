"use client"

import { useState, ChangeEvent, Fragment } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Types
type SessionType = "day" | "evening" | "weekend"

type ModuleRow = {
  id: string
  title: string
  startTime: string // e.g. "08:30"
  endTime: string // e.g. "12:00"
  venue: string
  lecturer: string
}

type SchoolGroup = {
  id: string
  schoolName: string
  modules: ModuleRow[]
}

type NewTimetable = {
  session: SessionType
  startDate: string // yyyy-mm-dd
  endDate: string // yyyy-mm-dd
  schools: SchoolGroup[]
}

// Utility helpers
const uid = (prefix = "id") =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}`

function timeToMinutes(t: string) {
  if (!t) return 0
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

// Conflict detection on the frontend (basic, mirrors backend rules)
function detectConflictsFromGroups(schools: SchoolGroup[]) {
  const conflicts: string[] = []

  // Room conflicts: same venue, overlapping times, same session (frontend knows session by page, we'll assume all here)
  const roomIndex: { [key: string]: ModuleRow[] } = {}
  const lecturerIndex: { [key: string]: ModuleRow[] } = {}

  for (const school of schools) {
    for (const mod of school.modules) {
      if (!mod.venue) continue
      const rKey = mod.venue.trim().toLowerCase()
      if (!roomIndex[rKey]) roomIndex[rKey] = []
      roomIndex[rKey].push(mod)

      const lKey = mod.lecturer.trim().toLowerCase()
      if (!lecturerIndex[lKey]) lecturerIndex[lKey] = []
      lecturerIndex[lKey].push(mod)
    }
  }

  // check overlaps in rooms
  for (const [venue, mods] of Object.entries(roomIndex)) {
    for (let i = 0; i < mods.length; i++) {
      for (let j = i + 1; j < mods.length; j++) {
        const a = mods[i]
        const b = mods[j]
        if (!a.startTime || !a.endTime || !b.startTime || !b.endTime) continue
        const aStart = timeToMinutes(a.startTime)
        const aEnd = timeToMinutes(a.endTime)
        const bStart = timeToMinutes(b.startTime)
        const bEnd = timeToMinutes(b.endTime)
        const overlap = Math.max(aStart, bStart) < Math.min(aEnd, bEnd)
        if (overlap) {
          conflicts.push(
            `Room conflict: "${venue}" used by "${a.title}" and "${b.title}" with overlapping times.`
          )
        }
      }
    }
  }

  // check lecturer assigned to two different modules at overlapping time
  for (const [lect, mods] of Object.entries(lecturerIndex)) {
    for (let i = 0; i < mods.length; i++) {
      for (let j = i + 1; j < mods.length; j++) {
        const a = mods[i]
        const b = mods[j]
        if (!a.startTime || !a.endTime || !b.startTime || !b.endTime) continue
        const aStart = timeToMinutes(a.startTime)
        const aEnd = timeToMinutes(a.endTime)
        const bStart = timeToMinutes(b.startTime)
        const bEnd = timeToMinutes(b.endTime)
        const overlap = Math.max(aStart, bStart) < Math.min(aEnd, bEnd)
        if (overlap) {
          conflicts.push(
            `Lecturer conflict: "${a.lecturer}" assigned to "${a.title}" and "${b.title}" at overlapping times.`
          )
        }
      }
    }
  }

  return conflicts
}

// Component
const NewTimetablePage = () => {
  const [session, setSession] = useState<SessionType>("day")
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [schools, setSchools] = useState<SchoolGroup[]>([
    {
      id: uid("school"),
      schoolName: "School of Business",
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

  function updateSchoolName(schoolId: string, name: string) {
    setSchools((prev) =>
      prev.map((s) => (s.id === schoolId ? { ...s, schoolName: name } : s))
    )
  }

  function addSchool() {
    setSchools((prev) => [
      ...prev,
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
  }

  function removeSchool(schoolId: string) {
    setSchools((prev) => prev.filter((s) => s.id !== schoolId))
  }

  function addModuleRow(schoolId: string) {
    setSchools((prev) =>
      prev.map((s) =>
        s.id === schoolId
          ? {
              ...s,
              modules: [
                ...s.modules,
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
          : s
      )
    )
  }

  function removeModuleRow(schoolId: string, moduleId: string) {
    setSchools((prev) =>
      prev.map((s) =>
        s.id === schoolId
          ? { ...s, modules: s.modules.filter((m) => m.id !== moduleId) }
          : s
      )
    )
  }

  function updateModuleField(
    schoolId: string,
    moduleId: string,
    field: keyof ModuleRow,
    value: string
  ) {
    setSchools((prev) =>
      prev.map((s) => {
        if (s.id !== schoolId) return s
        return {
          ...s,
          modules: s.modules.map((m) =>
            m.id === moduleId ? { ...m, [field]: value } : m
          ),
        }
      })
    )
  }

  async function handleSave() {
    // basic validation
    if (!startDate || !endDate) {
      setSaveState({
        saving: false,
        error: "Please provide start and end dates.",
      })
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      setSaveState({
        saving: false,
        error: "Start date cannot be after end date.",
      })
      return
    }

    setSaveState({ saving: true })

    const payload: NewTimetable = {
      session,
      startDate,
      endDate,
      schools,
    }

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/api/timetable`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setSaveState({
          saving: false,
          error: body?.message || `Save failed (${res.status})`,
        })
        return
      }

      setSaveState({ saving: false, success: "Timetable saved successfully." })
    } catch (err: any) {
      setSaveState({ saving: false, error: err.message || "Network error" })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Create New Timetable</h1>
          <div className="flex items-center gap-3">
            <Label>Session</Label>
            <select
              value={session}
              onChange={(e) => setSession(e.target.value as SessionType)}
              className="border rounded px-2 py-1"
            >
              <option value="day">Day (Morning & Afternoon)</option>
              <option value="evening">Evening</option>
              <option value="weekend">Weekend (Morning & Afternoon)</option>
            </select>

            <Label className="ml-4">Start</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setStartDate(e.target.value)
              }
            />
            <Label className="ml-2">End</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEndDate(e.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-4">
          {schools.map((s) => (
            <Card key={s.id} className="p-2">
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Input
                    value={s.schoolName}
                    onChange={(e) => updateSchoolName(s.id, e.target.value)}
                    className="w-64"
                  />
                  <Badge>Modules: {s.modules.length}</Badge>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => addModuleRow(s.id)}>
                    Add Module
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => removeSchool(s.id)}
                  >
                    Remove School
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {s.modules.map((m) => (
                    <Fragment key={m.id}>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                        <div className="md:col-span-2">
                          <Label>Module Title</Label>
                          <Input
                            value={m.title}
                            onChange={(e) =>
                              updateModuleField(
                                s.id,
                                m.id,
                                "title",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label>Start</Label>
                          <Input
                            type="time"
                            value={m.startTime}
                            onChange={(e) =>
                              updateModuleField(
                                s.id,
                                m.id,
                                "startTime",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label>End</Label>
                          <Input
                            type="time"
                            value={m.endTime}
                            onChange={(e) =>
                              updateModuleField(
                                s.id,
                                m.id,
                                "endTime",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label>Venue</Label>
                          <Input
                            value={m.venue}
                            onChange={(e) =>
                              updateModuleField(
                                s.id,
                                m.id,
                                "venue",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div>
                          <Label>Lecturer</Label>
                          <Input
                            value={m.lecturer}
                            onChange={(e) =>
                              updateModuleField(
                                s.id,
                                m.id,
                                "lecturer",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => removeModuleRow(s.id, m.id)}
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
