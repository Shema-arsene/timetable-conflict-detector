"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const Header = () => {
  const title = "</>"

  const [open, setOpen] = useState(false)
  const isLoggedIn = false // replace with real auth state

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-black">
          {/* Timetable Conflict Detector */}
          {title}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-black">
            Dashboard
          </Link>
          <Link href="/timetable" className="text-gray-700 hover:text-black">
            Timetable
          </Link>
          <Link href="/rooms" className="text-gray-700 hover:text-black">
            Rooms
          </Link>
          <Link href="/lecturers" className="text-gray-700 hover:text-black">
            Lecturers
          </Link>
          <Link href="/modules" className="text-gray-700 hover:text-black">
            Modules
          </Link>
          <Link href="/auth/signin">
            <Button variant="default">Sign In</Button>
          </Link>
        </nav>

        {/* Start */}
        {/* User dropdown */}
        {/* <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <Link href="/auth/signin">
              <Button variant="default">Sign In</Button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="User menu"
                  className="flex items-center space-x-2"
                >
                  <Avatar className="w-8 h-8">U</Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {}}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div> */}

        {/* End */}

        {/* Hamburger Button*/}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 cursor-pointer"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <Menu />
        </button>

        {/* Responsive Nav */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-64 bg-gray-50 transform transition-transform duration-500 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-5 flex items-center justify-end">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="cursor-pointer"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          <nav className="p-4 flex flex-col space-y-2">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="py-2 px-2 rounded hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              href="/timetable"
              onClick={() => setOpen(false)}
              className="py-2 px-2 rounded hover:bg-gray-100"
            >
              Timetable
            </Link>
            <Link
              href="/rooms"
              onClick={() => setOpen(false)}
              className="py-2 px-2 rounded hover:bg-gray-100"
            >
              Rooms
            </Link>
            <Link
              href="/lecturers"
              onClick={() => setOpen(false)}
              className="py-2 px-2 rounded hover:bg-gray-100"
            >
              Lecturers
            </Link>
            <Link
              href="/modules"
              onClick={() => setOpen(false)}
              className="py-2 px-2 rounded hover:bg-gray-100"
            >
              Modules
            </Link>
            {/* signin button */}
            <div className="flex items-center justify-center">
              <Link
                href="/auth/signin"
                onClick={() => setOpen(false)}
                className="mt-4"
              >
                <Button variant="default">Sign In</Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
