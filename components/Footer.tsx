const Footer = () => {
  return (
    <footer className="w-full border-t bg-gray-800">
      <div className="max-w-7xl mx-auto p-4 text-center text-gray-600">
        <p className="text-sm">
          © {new Date().getFullYear()} Timetable Conflict Detector. All rights
          reserved.
        </p>
        <p className="text-xs my-1">
          Built with Next.js, ShadCN, Node.js & MongoDB
        </p>
        <p className="text-xs">For University of Kigali</p>
      </div>
    </footer>
  )
}
export default Footer
