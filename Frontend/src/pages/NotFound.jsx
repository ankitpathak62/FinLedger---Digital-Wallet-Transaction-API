import { Link } from "react-router-dom"
import Logo from "../components/Logo"

export default function NotFound() {
  return (
    <div className="notfound">
      <Logo size={40} />
      <h1>404</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link className="btn btn--primary" to="/dashboard">
        Back to dashboard
      </Link>
    </div>
  )
}
