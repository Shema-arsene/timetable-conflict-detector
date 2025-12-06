import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

const ConflictsPage = () => {
  const conflicts = [
    {
      id: 1,
      issue: "Module A & Module B scheduled in same room",
      severity: "high",
    },
    {
      id: 2,
      issue: "Lecturer John assigned to two classes",
      severity: "medium",
    },
  ]

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Detected Conflicts</h1>

      <Card>
        <CardHeader>
          <CardTitle>Conflicts List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4">
            <ul className="space-y-2">
              {conflicts.map((c) => (
                <li
                  key={c.id}
                  className="p-3 rounded-md bg-red-50 border border-red-200 text-red-800"
                >
                  <strong>{c.issue}</strong> — Severity: {c.severity}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ConflictsPage
