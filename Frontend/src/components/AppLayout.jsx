import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import Logo from "./Logo"
import { GridIcon, SendIcon, LogoutIcon } from "./icons"

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: GridIcon },
  { to: "/transfer", label: "Transfer", icon: SendIcon },
]

export default function AppLayout() {
  const { user, logout } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    await logout()
    toast.success("You've been logged out.")
    navigate("/login", { replace: true })
  }

  const initials = (user?.name || "U")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="app-shell">
      {/* ---- Sidebar (desktop) ---- */}
      <aside className="sidebar">
        <div className="sidebar__brand">
          <Logo />
        </div>

        <nav className="sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="nav-link">
              <Icon className="nav-link__icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          <div className="user-chip">
            <span className="avatar">{initials}</span>
            <div className="user-chip__meta">
              <span className="user-chip__name">{user?.name}</span>
              <span className="user-chip__email">{user?.email}</span>
            </div>
          </div>
          <button className="btn btn--ghost btn--block" onClick={handleLogout} disabled={loggingOut}>
            <LogoutIcon className="nav-link__icon" />
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      {/* ---- Main column ---- */}
      <div className="app-main">
        {/* Mobile top bar */}
        <header className="topbar">
          <Logo size={28} />
          <button className="avatar avatar--btn" onClick={handleLogout} title="Sign out">
            {initials}
          </button>
        </header>

        <main className="content">
          <Outlet />
        </main>
      </div>

      {/* ---- Bottom nav (mobile) ---- */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className="bottom-nav__item">
            <Icon className="bottom-nav__icon" />
            <span>{label}</span>
          </NavLink>
        ))}
        <button className="bottom-nav__item bottom-nav__item--btn" onClick={handleLogout}>
          <LogoutIcon className="bottom-nav__icon" />
          <span>Sign out</span>
        </button>
      </nav>
    </div>
  )
}
