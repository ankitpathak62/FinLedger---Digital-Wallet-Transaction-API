/** Format a number as currency. The backend defaults accounts to INR. */
export function formatMoney(amount, currency = "INR") {
  const value = Number(amount) || 0
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${currency} ${value.toFixed(2)}`
  }
}

/** Shorten a Mongo ObjectId for display, e.g. "65f1…a2c9". */
export function shortId(id) {
  if (!id) return ""
  const s = String(id)
  if (s.length <= 10) return s
  return `${s.slice(0, 6)}…${s.slice(-4)}`
}

/** Generate an idempotency key for a transfer (used to make POSTs safe to retry). */
export function makeIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `tx-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/** Format an ISO date as a readable string. */
export function formatDate(iso) {
  if (!iso) return ""
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return iso
  }
}
