import { useEffect, useState } from "react"
import { accountApi } from "../api/services"
import { formatMoney, shortId, formatDate } from "../utils/format"
import { getErrorMessage } from "../api/client"
import CopyButton from "./CopyButton"
import Spinner from "./Spinner"
import { WalletIcon, RefreshIcon } from "./icons"

const STATUS_TONE = {
  ACTIVE: "badge--success",
  FROZEN: "badge--warn",
  CLOSED: "badge--muted",
}

export default function AccountCard({ account, index = 0 }) {
  const [balance, setBalance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function loadBalance() {
    setLoading(true)
    setError("")
    try {
      const { data } = await accountApi.balance(account._id)
      setBalance(data.balance)
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't load balance"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBalance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account._id])

  return (
    <article className="account-card" style={{ "--i": index }}>
      <div className="account-card__top">
        <span className="account-card__chip">
          <WalletIcon width={18} height={18} />
        </span>
        <span className={`badge ${STATUS_TONE[account.status] || "badge--muted"}`}>
          {account.status}
        </span>
      </div>

      <div className="account-card__balance">
        <span className="account-card__label">Available balance</span>
        {loading ? (
          <div className="account-card__loading">
            <Spinner size={20} light />
          </div>
        ) : error ? (
          <span className="account-card__error">{error}</span>
        ) : (
          <span className="account-card__amount">{formatMoney(balance, account.currency)}</span>
        )}
      </div>

      <div className="account-card__bottom">
        <div className="account-card__id">
          <span className="account-card__id-label">Account ID</span>
          <span className="account-card__id-value">
            <code>{shortId(account._id)}</code>
            <CopyButton value={account._id} label="Copy account ID" className="copy-btn--light" />
          </span>
        </div>
        <button
          className="icon-btn icon-btn--light"
          onClick={loadBalance}
          disabled={loading}
          title="Refresh balance"
          aria-label="Refresh balance"
        >
          <RefreshIcon width={16} height={16} />
        </button>
      </div>

      {account.createdAt && (
        <span className="account-card__date">Opened {formatDate(account.createdAt)}</span>
      )}
    </article>
  )
}
