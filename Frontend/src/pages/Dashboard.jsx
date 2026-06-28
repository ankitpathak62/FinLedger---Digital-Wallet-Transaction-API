import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { accountApi } from "../api/services"
import { getErrorMessage } from "../api/client"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../context/ToastContext"
import { formatMoney } from "../utils/format"
import AccountCard from "../components/AccountCard"
import Spinner from "../components/Spinner"
import { PlusIcon, SendIcon, WalletIcon, RefreshIcon } from "../components/icons"

export default function Dashboard() {
  const { user } = useAuth()
  const toast = useToast()

  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)
  const [totals, setTotals] = useState({ balance: 0, ready: false })

  async function loadAccounts() {
    setLoading(true)
    setError("")
    try {
      const { data } = await accountApi.list()
      const list = data.accounts || []
      setAccounts(list)
      computeTotal(list)
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load your accounts"))
    } finally {
      setLoading(false)
    }
  }

  // Sum balances across accounts for the summary header.
  async function computeTotal(list) {
    if (!list.length) {
      setTotals({ balance: 0, ready: true })
      return
    }
    setTotals((t) => ({ ...t, ready: false }))
    try {
      const results = await Promise.all(
        list.map((a) => accountApi.balance(a._id).then((r) => r.data.balance).catch(() => 0))
      )
      const sum = results.reduce((acc, b) => acc + (Number(b) || 0), 0)
      setTotals({ balance: sum, ready: true })
    } catch {
      setTotals({ balance: 0, ready: true })
    }
  }

  useEffect(() => {
    loadAccounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleCreate() {
    setCreating(true)
    try {
      await accountApi.create()
      toast.success("New account opened 🎉")
      await loadAccounts()
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't open a new account"))
    } finally {
      setCreating(false)
    }
  }

  const firstName = user?.name?.split(" ")[0] || "there"
  const currency = accounts[0]?.currency || "INR"

  return (
    <div className="page">
      <header className="page__head">
        <div>
          <p className="page__eyebrow">Welcome back</p>
          <h1 className="page__title">Hi, {firstName} 👋</h1>
        </div>
        <div className="page__actions">
          <button
            className="btn btn--ghost"
            onClick={loadAccounts}
            disabled={loading}
            title="Refresh"
          >
            <RefreshIcon width={18} height={18} />
            <span className="hide-sm">Refresh</span>
          </button>
          <button className="btn btn--primary" onClick={handleCreate} disabled={creating}>
            {creating ? <Spinner size={18} light /> : <PlusIcon width={18} height={18} />}
            New account
          </button>
        </div>
      </header>

      {/* Summary banner */}
      <section className="summary">
        <div className="summary__main">
          <span className="summary__label">
            <WalletIcon width={16} height={16} /> Total balance
          </span>
          <div className="summary__value">
            {totals.ready ? (
              formatMoney(totals.balance, currency)
            ) : (
              <span className="summary__loading">
                <Spinner size={22} light />
              </span>
            )}
          </div>
          <span className="summary__meta">
            Across {accounts.length} account{accounts.length === 1 ? "" : "s"}
          </span>
        </div>
        <Link to="/transfer" className="summary__cta">
          <SendIcon width={18} height={18} />
          Send money
        </Link>
      </section>

      {/* Accounts grid */}
      <section className="section">
        <div className="section__head">
          <h2 className="section__title">Your accounts</h2>
        </div>

        {loading ? (
          <div className="state state--loading">
            <Spinner size={32} />
            <p>Loading your accounts…</p>
          </div>
        ) : error ? (
          <div className="state state--error">
            <p>{error}</p>
            <button className="btn btn--ghost" onClick={loadAccounts}>
              Try again
            </button>
          </div>
        ) : accounts.length === 0 ? (
          <div className="state state--empty">
            <div className="state__icon">
              <WalletIcon width={28} height={28} />
            </div>
            <h3>No accounts yet</h3>
            <p>Open your first account to start receiving and sending money.</p>
            <button className="btn btn--primary" onClick={handleCreate} disabled={creating}>
              {creating ? <Spinner size={18} light /> : <PlusIcon width={18} height={18} />}
              Open an account
            </button>
          </div>
        ) : (
          <div className="account-grid">
            {accounts.map((account, i) => (
              <AccountCard key={account._id} account={account} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
