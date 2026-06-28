export default function Logo({ size = 32, withText = true }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6366f1" />
            <stop offset="1" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="16" fill="url(#logoGrad)" />
        <path
          d="M20 22h24M20 32h24M20 42h14"
          stroke="#fff"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {withText && <span className="logo__text">Ledger</span>}
    </span>
  )
}
