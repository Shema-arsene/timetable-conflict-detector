// "use client"

// import { useEffect, useState } from "react"
// import axios from "axios"
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import Link from "next/link"

// type Room = {
//   _id: string
//   name: string
//   campus: string
//   capacity?: number
// }

// const RoomsPage = () => {
//   const [rooms, setRooms] = useState<Room[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     // const fetchRooms = async () => {
//     //   try {
//     //     const res = await axios.get(
//     //       `${process.env.NEXT_PUBLIC_API_URL}/api/rooms`,
//     //     )
//     //     setRooms(res.data)
//     //   } catch (err: any) {
//     //     setError(err.message || "Failed to load rooms")
//     //   } finally {
//     //     setLoading(false)
//     //   }
//     // }
//     // fetchRooms()
//   }, [])

//   return (
//     <div className="min-h-screen p-6 bg-gray-50">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Rooms</h1>
//           <Link href="/rooms/new">
//             <Button>Add New Room</Button>
//           </Link>
//         </div>

//         {loading && <p>Loading rooms...</p>}
//         {error && <p className="text-red-600">{error}</p>}

//         <div className="grid gap-4">
//           {rooms.map((room) => (
//             <Card key={room._id}>
//               <CardHeader className="flex justify-between items-center">
//                 <CardTitle>{room.name}</CardTitle>
//                 <Badge>{room.campus}</Badge>
//               </CardHeader>
//               <CardContent>
//                 <p>Capacity: {room.capacity || "N/A"}</p>
//                 <div className="mt-2 flex gap-2">
//                   <Link href={`/rooms/edit/${room._id}`}>
//                     <Button size="sm">Edit</Button>
//                   </Link>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default RoomsPage

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Room = {
  _id: string
  name: string
  campus: string
  capacity: number
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/rooms`,
        )
        setRooms(res.data)
      } catch (err) {
        setError("Failed to fetch rooms")
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Card className="max-w-6xl mx-auto p-3 md:p-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">Rooms</CardTitle>
          <Link href="/rooms/new">
            <Button>Add Room</Button>
          </Link>
        </CardHeader>

        <CardContent>
          {loading && <p>Loading rooms...</p>}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && rooms.length === 0 && (
            <p className="text-sm text-gray-600">
              No rooms found. Create one to get started.
            </p>
          )}

          {!loading && rooms.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Campus</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room._id}>
                    <TableCell className="font-semibold">{room.name}</TableCell>
                    <TableCell>{room.campus}</TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/rooms/${room._id}`}>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
