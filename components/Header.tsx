"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const Header = () => {
  const router = useRouter()

  const { user, isAuthenticated, logout } = useAuth()
  const isAdminOrDean = user?.role === "admin" || user?.role === "dean"

  const title = "</>"
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isLoggedIn = !!user

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/public/timetable", label: "Timetable" },
    { href: "/public/rooms", label: "Rooms" },
    { href: "/public/lecturers", label: "Lecturers" },
    { href: "/public/schools", label: "Schools" },
    { href: "/public/modules", label: "Modules" },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === href
    return pathname.startsWith(href)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
    toast.success("Logged out", {
      description: "You have been successfully logged out.",
    })
  }

  const getInitials = (firstName: string, secondName: string) => {
    const firstInitial = firstName?.charAt(0).toUpperCase() || ""
    const lastInitial = secondName?.charAt(0).toUpperCase() || ""
    return `${firstInitial}${lastInitial}`
  }
  const userInitials = user ? getInitials(user.firstName, user.secondName) : ""

  const capitalizeName = (firstName: string, secondName: string) => {
    const capitalizedFirst =
      firstName?.charAt(0).toUpperCase() + firstName?.slice(1).toLowerCase() ||
      ""
    const capitalizedLast =
      secondName?.charAt(0).toUpperCase() +
        secondName?.slice(1).toLowerCase() || ""
    return `${capitalizedFirst} ${capitalizedLast}`
  }
  const fullName = user ? capitalizeName(user.firstName, user.secondName) : ""

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-2xl font-bold text-black">
          {/* Timetable Conflict Detector */}
          {title}
        </Link>

        {/* Desktop Nav */}
        <nav className="font-semibold hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-1 py-2 text-gray-700 hover:text-black transition-colors duration-200 group ${
                isActive(link.href) ? "text-black font-bold" : ""
              }`}
            >
              {link.label}
              {/* Underline animation for active and hover */}
              <span
                className={`absolute bottom-0 left-0 h-0.5 bg-black transition-[width] duration-300 ease-out origin-left ${
                  isActive(link.href) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Avatar with initials */}
              <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-600 flex items-center justify-center text-gray-600 text-sm font-medium">
                {userInitials}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {fullName}
                </span>
                {isAdminOrDean && (
                  <span className="text-xs text-gray-500">
                    {user?.role === "admin" ? "Admin" : "Dean"}
                  </span>
                )}
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/public/auth/signin">
              <Button variant="default">Sign In</Button>
            </Link>
          )}
        </nav>

        {/* Hamburger Button*/}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100 cursor-pointer"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <Menu />
        </button>

        {/* Responsive Nav */}
        {/* Responsive Nav */}
        <div
          className={`md:hidden fixed top-0 right-0 h-full w-64 bg-gray-50 shadow-lg transform transition-transform duration-500 ease-in-out z-50 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-5 flex items-center justify-end">
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="cursor-pointer hover:bg-gray-200 p-2 rounded"
            >
              <X className="h-7 w-7" />
            </button>
          </div>

          <nav className="p-4 flex flex-col space-y-2">
            {/* User info in mobile menu */}
            {isAuthenticated && (
              <div className="py-2 px-4 border-b mb-2">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.secondName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                {isAdminOrDean && (
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {user?.role === "admin" ? "Admin" : "Dean"}
                  </span>
                )}
              </div>
            )}

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`relative py-2 px-4 rounded transition-all duration-200 overflow-hidden group ${
                  isActive(link.href)
                    ? "bg-gray-100 text-black font-bold"
                    : "hover:bg-gray-100 font-semibold"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                <span
                  className={`absolute left-0 top-0 h-full bg-gray-200 transform transition-transform duration-300 z-0 ${
                    isActive(link.href)
                      ? "translate-x-0 w-full"
                      : "-translate-x-full group-hover:translate-x-0 w-full"
                  }`}
                />
              </Link>
            ))}

            {/* Auth buttons for mobile - FIXED: No nested Links */}
            <div className="flex items-center justify-center pt-4 mt-2 border-t">
              {isAuthenticated ? (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleLogout()
                    setOpen(false)
                  }}
                  className="w-full"
                >
                  Sign Out
                </Button>
              ) : (
                <Link
                  href="/auth/signin"
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
                  <Button variant="default" className="w-full">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
