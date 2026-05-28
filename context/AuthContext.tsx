"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import {
  User,
  getCurrentUser,
  isAuthenticated,
  logoutUser,
  setupAuthInterceptor,
} from "@/services/auth"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  updateUser: (user: User | null) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setupAuthInterceptor()
    const token = localStorage.getItem("token")

    if (token) {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }
    setLoading(false)
  }, [])

  const updateUser = (userData: User | null) => {
    setUser(userData)
  }

  const logout = () => {
    logoutUser()
    setUser(null)
    // router.push("public/auth/signin")
    router.push("/")
  }

  useEffect(() => {
    setupAuthInterceptor()

    const checkAuth = () => {
      const token = localStorage.getItem("token")
      if (token) {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    }

    checkAuth()

    // Listen for storage changes (for cross-tab updates)
    window.addEventListener("storage", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        logout,
        loading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
