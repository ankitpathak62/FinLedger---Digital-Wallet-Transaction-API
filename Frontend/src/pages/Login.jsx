import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { getErrorMessage } from "../api/client"
import AuthShell from "../components/AuthShell"
import Field from "../components/Field"
import Spinner from "../components/Spinner"

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((er) => ({ ...er, [e.target.name]: "" }))
  }

  function validate() {
    const next = {}
    if (!form.email.trim()) next.email = "Email is required"
    if (!form.password) next.password = "Password is required"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const user = await login(form)
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`)
      navigate("/dashboard", { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, "Invalid email or password"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <div className="auth__card-head">
        <h2>Welcome back</h2>
        <p>Sign in to your Ledger account to continue.</p>
      </div>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={update}
          error={errors.email}
          autoComplete="email"
        />
        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={update}
          error={errors.password}
          autoComplete="current-password"
        />

        <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner size={18} light /> Signing in…
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="auth__switch">
        Don&apos;t have an account? <Link to="/register">Create one</Link>
      </p>
    </AuthShell>
  )
}
