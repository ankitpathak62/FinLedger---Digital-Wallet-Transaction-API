import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { getErrorMessage } from "../api/client"
import AuthShell from "../components/AuthShell"
import Field from "../components/Field"
import Spinner from "../components/Spinner"

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export default function Register() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: "", email: "", password: "" })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((er) => ({ ...er, [e.target.name]: "" }))
  }

  function validate() {
    const next = {}
    if (!form.name.trim()) next.name = "Name is required"
    if (!form.email.trim()) next.email = "Email is required"
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email address"
    if (!form.password) next.password = "Password is required"
    else if (form.password.length < 6) next.password = "Use at least 6 characters"
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const user = await register(form)
      toast.success(`Account created. Welcome, ${user.name.split(" ")[0]}!`)
      navigate("/dashboard", { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't create your account"))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell>
      <div className="auth__card-head">
        <h2>Create your account</h2>
        <p>Start moving money in under a minute.</p>
      </div>

      <form className="auth__form" onSubmit={handleSubmit} noValidate>
        <Field
          label="Full name"
          name="name"
          placeholder="Ada Lovelace"
          value={form.name}
          onChange={update}
          error={errors.name}
          autoComplete="name"
        />
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
          placeholder="At least 6 characters"
          value={form.password}
          onChange={update}
          error={errors.password}
          hint={!errors.password ? "Minimum 6 characters" : undefined}
          autoComplete="new-password"
        />

        <button className="btn btn--primary btn--block" type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner size={18} light /> Creating account…
            </>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="auth__switch">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </AuthShell>
  )
}
