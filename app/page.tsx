import { AlertTriangle } from "lucide-react"

const Home = () => {
  return (
    <main className="p-5 flex items-center justify-center h-screen w-screen">
      <div className="flex flex-col items-center gap-5">
        <AlertTriangle className="text-red-600" height={50} width={50} />
        <h1 className="text-3xl font-bold">Timetable conflict detector</h1>
      </div>
    </main>
  )
}

export default Home
