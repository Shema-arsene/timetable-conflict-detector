// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// interface RoomForm {
//   name: string
//   capacity: string // we'll keep it string to match Input value
// }

// const AddRoomPage = () => {
//   const router = useRouter()
//   const [loading, setLoading] = useState(false)
//   const [form, setForm] = useState<RoomForm>({
//     name: "",
//     capacity: "",
//   })
//   const [error, setError] = useState<string>("")

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()

//     // Validation
//     if (!form.name.trim()) {
//       setError("Room name is required")
//       return
//     }
//     const capacityNumber = Number(form.capacity)
//     if (!form.capacity || isNaN(capacityNumber) || capacityNumber <= 0) {
//       setError("Capacity must be a positive number")
//       return
//     }

//     setError("")
//     setLoading(true)

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: form.name, capacity: capacityNumber }),
//       })

//       if (!res.ok) throw new Error("Failed to create room")

//       router.push("/rooms")
//     } catch (err) {
//       console.error(err)
//       setError("Failed to add room. Please try again.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="max-w-xl">
//       <Card>
//         <CardHeader>
//           <CardTitle>Add Room</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {error && <p className="text-red-500 mb-3">{error}</p>}
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-1">
//               <Label htmlFor="name">Room Name</Label>
//               <Input
//                 id="name"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="space-y-1">
//               <Label htmlFor="capacity">Capacity</Label>
//               <Input
//                 id="capacity"
//                 name="capacity"
//                 type="number"
//                 value={form.capacity}
//                 onChange={handleChange}
//                 placeholder="Number of seats"
//                 required
//               />
//             </div>

//             <div className="flex justify-end gap-2 pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => router.back()}
//                 disabled={loading}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={loading}>
//                 {loading ? "Saving..." : "Create Room"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default AddRoomPage

"use client"

import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type RoomPayload = {
  name: string
  campus: string
  capacity: number
}

export default function AddRoomPage() {
  const router = useRouter()

  const [form, setForm] = useState<RoomPayload>({
    name: "",
    campus: "",
    capacity: 0,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/rooms`, form)
      router.push("/rooms")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create room")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl">Add New Room</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Room Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Room Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Lab A, Room 101"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Campus */}
            <div className="space-y-1">
              <Label htmlFor="campus">Campus</Label>
              <Input
                id="campus"
                name="campus"
                placeholder="e.g. Kacyiru"
                value={form.campus}
                onChange={handleChange}
                required
              />
            </div>

            {/* Capacity */}
            <div className="space-y-1">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                min={0}
                value={form.capacity}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Create Room"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/rooms")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
