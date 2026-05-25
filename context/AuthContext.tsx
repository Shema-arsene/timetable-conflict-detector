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

  const logout = () => {
    logoutUser()
    setUser(null)
    router.push("/auth/signin")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
