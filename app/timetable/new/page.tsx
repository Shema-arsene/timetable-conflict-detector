"use client"

import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const NewTimetablePage = () => {
  const [session, setSession] = useState("")
  const [moduleName, setModuleName] = useState("")
  const [lecturer, setLecturer] = useState("")
  const [room, setRoom] = useState("")

  const handleCreate = () => {
    // TODO: Hook to backend create timetable logic
    console.log({ session, moduleName, lecturer, room })
  }

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <Card className="w-full max-w-xl shadow-md p-2">
        <CardHeader>
          <CardTitle className="text-2xl">Create Timetable</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Session</Label>
            <Input
              placeholder="Morning / Afternoon / Evening / Weekend"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Module Name</Label>
            <Input
              placeholder="Enter module name"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Lecturer</Label>
            <Input
              placeholder="Lecturer name"
              value={lecturer}
              onChange={(e) => setLecturer(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Room</Label>
            <Input
              placeholder="Room number"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>

          <Button className="w-full mt-4" onClick={handleCreate}>
            Save Timetable
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default NewTimetablePage
