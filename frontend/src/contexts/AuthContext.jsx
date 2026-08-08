"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { jwtDecode } from "jwt-decode"
import api from "../services/api"

const AuthContext = createContext()
//custom hook
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (token) {
      try {
        const decodedToken = jwtDecode(token)
        if (decodedToken.exp * 1000 > Date.now()) {
          // Token is valid, fetch user profile
          fetchUserProfile(token)
        } else {
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          setLoading(false)
        }
      } catch (error) {
        console.error("Invalid token:", error)
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUserProfile = async (token) => {
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`
      const response = await api.get("/auth/profile/")
      setUser(response.data)
    } catch (error) {
      console.error("Error fetching user profile:", error)
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login/", {
        email,
        password,
      })

      const { access, refresh, user: userData } = response.data

      localStorage.setItem("access_token", access)
      localStorage.setItem("refresh_token", refresh)

      setUser(userData)
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await api.post("/auth/signup/", userData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Signup failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    delete api.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
