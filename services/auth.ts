import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface User {
  id: string
  firstName: string
  secondName: string
  email: string
  role: string
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  secondName: string,
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/api/auth/register`, {
    firstName,
    secondName,
    email,
    password,
  })

  if (response.data.token) {
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
  }

  return response.data
}

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    email,
    password,
  })

  const user = response.data.user as User

  if (response.data.token) {
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(user))
  }

  return response.data
}

export const logoutUser = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

export const getToken = (): string | null => {
  return localStorage.getItem("token")
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}

export const setupAuthInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error),
  )
}
