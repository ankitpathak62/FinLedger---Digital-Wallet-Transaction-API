import { Navigate, Route, Routes } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import AppLayout from "./components/AppLayout"
import Spinner from "./components/Spinner"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Transfer from "./pages/Transfer"
import NotFound from "./pages/NotFound"

/** Only render children when logged in, otherwise bounce to /login. */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <FullScreenLoader />
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

/** Keep authenticated users away from the auth pages. */
function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <FullScreenLoader />
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

function FullScreenLoader() {
  return (
    <div className="fullscreen-loader">
      <Spinner size={40} />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transfer" element={<Transfer />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
