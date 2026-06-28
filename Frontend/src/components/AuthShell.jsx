import Logo from "./Logo"

/** Split-screen marketing panel + form, collapses to a single column on mobile. */
export default function AuthShell({ children }) {
  return (
    <div className="auth">
      <aside className="auth__aside">
        <div className="auth__aside-inner">
          <Logo size={36} />
          <h1 className="auth__headline">
            Move money with a<br />
            ledger you can trust.
          </h1>
          <p className="auth__sub">
            Double-entry accounting, immutable records and instant balances — wrapped in a
            dashboard that just works.
          </p>
          <ul className="auth__features">
            <li>Open multiple accounts in one tap</li>
            <li>Real-time balances derived from the ledger</li>
            <li>Safe, idempotent transfers</li>
          </ul>
        </div>
        <div className="auth__glow auth__glow--1" />
        <div className="auth__glow auth__glow--2" />
      </aside>

      <main className="auth__main">
        <div className="auth__card">{children}</div>
      </main>
    </div>
  )
}
