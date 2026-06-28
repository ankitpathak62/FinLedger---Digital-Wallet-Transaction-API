import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { authApi } from "../api/services"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Re-hydrate the session from localStorage on first load.
  useEffect(() => {
    try {
      const stored = localStorage.getItem("ledger_user")
      const token = localStorage.getItem("ledger_token")
      if (stored && token) {
        setUser(JSON.parse(stored))
      }
    } catch {
      localStorage.removeItem("ledger_user")
      localStorage.removeItem("ledger_token")
    }
    setLoading(false)
  }, [])

  function persist(data) {
    setUser(data.user)
    localStorage.setItem("ledger_user", JSON.stringify(data.user))
    if (data.token) {
      localStorage.setItem("ledger_token", data.token)
    }
  }

  async function login(credentials) {
    const { data } = await authApi.login(credentials)
    persist(data)
    return data.user
  }

  async function register(payload) {
    const { data } = await authApi.register(payload)
    persist(data)
    return data.user
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // Even if the server call fails, clear the client session.
    }
    setUser(null)
    localStorage.removeItem("ledger_user")
    localStorage.removeItem("ledger_token")
  }

  const value = useMemo(
    () => ({ user, loading, login, register, logout, isAuthenticated: Boolean(user) }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
