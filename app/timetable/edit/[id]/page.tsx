"use client"

import { Fragment, useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { CAMPUSES } from "@/constants/campus"
import { toast } from "sonner"
import { validateTimetableDates } from "@/lib/dateValidation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
      const lecturer = lecturersList.find((l) => l._id === m.lecturerId)
      const lecturerName = lecturer
        ? `${lecturer.firstName} ${lecturer.lastName}`
        : ""

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

const EditTimetablePage = () => {
  const router = useRouter()
  const params = useParams()
  const timetableId = params.id as string

  // API data
  const [schoolsList, setSchoolsList] = useState<any[]>([])
  const [modulesList, setModulesList] = useState<any[]>([])
  const [roomsList, setRoomsList] = useState<any[]>([])
  const [lecturersList, setLecturersList] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timetableHeading, setTimetableHeading] = useState("")

  // Local state
  const [session, setSession] = useState<SessionType>("day")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [schools, setSchools] = useState<SchoolGroup[]>([])

  const [saving, setSaving] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schoolsRes, modulesRes, roomsRes, lecturersRes, timetableRes] =
          await Promise.all([
            axios.get(`${API_URL}/api/schools`),
            axios.get(`${API_URL}/api/modules`),
            axios.get(`${API_URL}/api/rooms`),
            axios.get(`${API_URL}/api/lecturers`),
            axios.get(`${API_URL}/api/timetables/${timetableId}`),
          ])

        setSchoolsList(schoolsRes.data)
        setModulesList(modulesRes.data)
        setRoomsList(roomsRes.data)
        setLecturersList(lecturersRes.data)

        // Populate form with existing timetable data
        const timetable = timetableRes.data
        setTimetableHeading(timetable.title)
        setSession(timetable.session)
        setStartDate(timetable.startDate.split("T")[0]) // Format date for input
        setEndDate(timetable.endDate.split("T")[0])

        // Transform backend entries into frontend SchoolGroup structure
        const groupedBySchool = timetable.entries.reduce(
          (acc: any, entry: any) => {
            const schoolId = entry.schoolId._id
            if (!acc[schoolId]) {
              acc[schoolId] = {
                id: uid("school"),
                schoolId: schoolId,
                modules: [],
              }
            }
            acc[schoolId].modules.push({
              id: uid("m"),
              moduleId: entry.moduleId._id,
              startTime: entry.startTime,
              endTime: entry.endTime,
              roomId: entry.roomId._id,
              lecturerId: entry.lecturerId._id,
              campus: entry.campus,
            })
            return acc
          },
          {},
        )

        setSchools(Object.values(groupedBySchool))
      } catch (error) {
        toast.error("Failed to fetch timetable:", {
          description: "There was an error fetching the timetable data.",
        })
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (timetableId) {
      fetchData()
    }
  }, [timetableId])

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
            startTime: "00:00",
            endTime: "00:00",
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
        m.startTime !== "00:00" && !isStartTimeInFuture(startDate, m.startTime),
    ),
  )

  useEffect(() => {
    if (hasPastStartTime) {
      toast.error("Error fetching timetable data", {
        description:
          "One or more module entries have a start time in the past. Please update the start times to be in the future before saving.",
      })
    }
  }, [hasPastStartTime])

  const handleUpdate = async () => {
    if (!startDate || !endDate) {
      toast.error("Failed to update timetable", {
        description: "Start date and end date are required.",
      })
      return
    }

    const dateValidation = validateTimetableDates(startDate, endDate)
    if (!dateValidation.valid) {
      toast.error("Cannot update timetable", {
        description: dateValidation.message,
      })
      return
    }

    if (!timetableHeading || timetableHeading.trim() === "") {
      toast.error("Failed to update timetable", {
        description: "Timetable title is required.",
      })

      return
    }

    if (conflicts.length) {
      toast.error("Failed to update timetable", {
        description:
          "There are conflicts in the timetable. Please resolve them before saving.",
      })

      return
    }

    setSaving(true)

    // Transform nested schools into flat entries array
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

    // Filter out any incomplete entries
    const validEntries = entries.filter((entry) => {
      const hasRequiredFields =
        entry.schoolId &&
        entry.schoolId.trim() !== "" &&
        entry.moduleId &&
        entry.moduleId.trim() !== "" &&
        entry.lecturerId &&
        entry.lecturerId.trim() !== "" &&
        entry.roomId &&
        entry.roomId.trim() !== ""

      const hasValidTimes =
        entry.startTime !== "00:00" && entry.endTime !== "00:00"

      return hasRequiredFields && hasValidTimes
    })

    if (validEntries.length === 0) {
      toast("Failed to update timetable", {
        description:
          "Please select a school, module, lecturer, room, and set valid times for at least one entry.",
      })
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
      await axios.put(`${API_URL}/api/timetables/${timetableId}`, payload)
      toast.success("Success", {
        description: "Timetable updated successfully!",
      })
      setTimeout(() => {
        router.push("/timetable")
      }, 1500)
    } catch (err: any) {
      console.error("Update error:", err.response?.data || err.message)
      toast.error(err.response?.data?.message || "Failed to update timetable")
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    const loadingToast = toast.loading("Deleting timetable...")

    try {
      await axios.delete(`${API_URL}/api/timetable/${timetableId}`)
      toast.dismiss(loadingToast)
      toast.success("Timetable deleted", {
        description: "The timetable has been permanently removed.",
      })
      router.push("/timetable")
    } catch (err: any) {
      toast.dismiss(loadingToast)
      setDeleting(false)
      setDeleteDialogOpen(false)
      toast.error("Deletion failed", {
        description:
          err.response?.data?.message || "Failed to delete timetable",
      })
    }
  }

  // Calculate week display
  const getWeekDisplay = () => {
    if (!startDate || !endDate) return null
    const diffDays = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    )
    const weeks = diffDays / 7
    return weeks.toFixed(1)
  }

  const getWeekBadgeColor = () => {
    if (!startDate || !endDate) return ""
    const diffDays = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24),
    )
    const weeks = diffDays / 7
    if (weeks >= 3 && weeks <= 4)
      return "bg-green-50 text-green-700 border-green-200"
    if (weeks < 3) return "bg-yellow-50 text-yellow-700 border-yellow-200"
    return "bg-red-50 text-red-700 border-red-200"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <Card className="w-full max-w-lg p-6">
          <div className="text-center py-8">Loading timetable...</div>
        </Card>
      </div>
    )
  }

  //   UI
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xl md:text-2xl font-bold">Edit Timetable</h1>
        <Button
          variant="destructive"
          onClick={() => setDeleteDialogOpen(true)}
          disabled={saving}
        >
          Delete Timetable
        </Button>
      </div>

      <Card className="p-3 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-start mb-4">
            <div className="w-full text-xl md:text-2xl font-semibold my-5 uppercase">
              <Input
                type="text"
                value={timetableHeading}
                onChange={(e) => setTimetableHeading(e.target.value)}
                className="w-full"
                placeholder="Timetable Title - Module One Teaching Timetable Extract SEPT 2026 - DEC 2026"
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

              {/* Week indicator */}
              {startDate && endDate && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getWeekBadgeColor()}>
                    {getWeekDisplay()} weeks
                  </Badge>
                  <span className="text-xs text-gray-500">
                    (3-4 weeks required)
                  </span>
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
                                  {mod.name} ({mod.code})
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

                        {/* Module-level validation messages */}
                        <div className="text-xs text-yellow-700 mt-1">
                          {module.startTime !== "00:00" &&
                            module.endTime !== "00:00" &&
                            timeToMinutes(module.startTime) >=
                              timeToMinutes(module.endTime) && (
                              <div className="text-red-600">
                                ⚠️ Invalid time range: start should be before
                                end.
                              </div>
                            )}

                          {module.startTime !== "00:00" &&
                            !isStartTimeInFuture(
                              startDate,
                              module.startTime,
                            ) && (
                              <div className="text-red-700">
                                ⚠️ Start time must be in the future.
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
                {/* Keep conflict display inline since it's part of the form */}
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

                {/* Remove saveState.error and saveState.success divs */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/timetable")}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleUpdate} disabled={saving}>
                    {saving ? "Updating..." : "Update Timetable"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog using AlertDialog component */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                timetable &quot;{timetableHeading}&quot; and remove all its data
                from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleting ? "Deleting..." : "Yes, delete it"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  )
}

export default EditTimetablePage
