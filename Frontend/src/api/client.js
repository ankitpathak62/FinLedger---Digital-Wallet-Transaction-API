import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL || "https://finledger-digital-wallet-transaction-api-eo8t.onrender.com"

/**
 * Shared axios instance.
 * - withCredentials lets the backend's auth cookie flow on cross-origin calls.
 * - A request interceptor also attaches the JWT as a Bearer token (the backend
 *   accepts either the cookie or the Authorization header), which keeps auth
 *   working even when third-party cookies are blocked.
 */
const api = axios.create({
  baseURL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ledger_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Surface a friendly message and auto-logout on auth failure.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status
    if (status === 401) {
      localStorage.removeItem("ledger_token")
      localStorage.removeItem("ledger_user")
      // Avoid redirect loops on the auth pages themselves.
      const onAuthPage = ["/login", "/register"].includes(window.location.pathname)
      if (!onAuthPage) {
        window.location.assign("/login")
      }
    }
    return Promise.reject(error)
  }
)

/** Pull a human-readable message out of an axios error. */
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  )
}

export default api
