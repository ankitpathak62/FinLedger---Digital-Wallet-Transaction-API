import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { accountApi, transactionApi } from "../api/services"
import { getErrorMessage } from "../api/client"
import { useToast } from "../context/ToastContext"
import { formatMoney, shortId, makeIdempotencyKey } from "../utils/format"
import Field from "../components/Field"
import Spinner from "../components/Spinner"
import CopyButton from "../components/CopyButton"
import { ArrowRightIcon, SendIcon, CheckIcon, WalletIcon } from "../components/icons"

export default function Transfer() {
  const toast = useToast()

  const [accounts, setAccounts] = useState([])
  const [balances, setBalances] = useState({})
  const [loadingAccounts, setLoadingAccounts] = useState(true)

  const [form, setForm] = useState({ fromAccount: "", toAccount: "", amount: "" })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  async function loadAccounts() {
    setLoadingAccounts(true)
    try {
      const { data } = await accountApi.list()
      const list = data.accounts || []
      setAccounts(list)
      if (list.length && !form.fromAccount) {
        setForm((f) => ({ ...f, fromAccount: list[0]._id }))
      }
      // Fetch balances in parallel for the source selector.
      const entries = await Promise.all(
        list.map((a) =>
          accountApi
            .balance(a._id)
            .then((r) => [a._id, r.data.balance])
            .catch(() => [a._id, null])
        )
      )
      setBalances(Object.fromEntries(entries))
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't load your accounts"))
    } finally {
      setLoadingAccounts(false)
    }
  }

  useEffect(() => {
    loadAccounts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedBalance = balances[form.fromAccount]

  function update(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setErrors((er) => ({ ...er, [e.target.name]: "" }))
  }

  function validate() {
    const next = {}
    const amount = Number(form.amount)
    if (!form.fromAccount) next.fromAccount = "Choose a source account"
    if (!form.toAccount.trim()) next.toAccount = "Enter a destination account ID"
    else if (form.toAccount.trim() === form.fromAccount)
      next.toAccount = "Source and destination must differ"
    if (!form.amount) next.amount = "Enter an amount"
    else if (Number.isNaN(amount) || amount <= 0) next.amount = "Amount must be greater than 0"
    else if (selectedBalance != null && amount > selectedBalance)
      next.amount = `Exceeds balance (${formatMoney(selectedBalance)})`
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    setResult(null)

    const payload = {
      fromAccount: form.fromAccount,
      toAccount: form.toAccount.trim(),
      amount: Number(form.amount),
      idempotencyKey: makeIdempotencyKey(),
    }

    try {
      const { data } = await transactionApi.transfer(payload)
      setResult({ ok: true, ...data, amount: payload.amount, toAccount: payload.toAccount })
      toast.success("Transfer completed")
      setForm((f) => ({ ...f, toAccount: "", amount: "" }))
      loadAccounts()
    } catch (err) {
      toast.error(getErrorMessage(err, "Transfer failed"))
      setResult({ ok: false, message: getErrorMessage(err, "Transfer failed") })
    } finally {
      setSubmitting(false)
    }
  }

  const fromOptions = useMemo(
    () => accounts.filter((a) => a.status === "ACTIVE"),
    [accounts]
  )

  return (
    <div className="page page--narrow">
      <header className="page__head">
        <div>
          <p className="page__eyebrow">Payments</p>
          <h1 className="page__title">Send money</h1>
        </div>
      </header>

      {loadingAccounts ? (
        <div className="state state--loading">
          <Spinner size={32} />
          <p>Loading your accounts…</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="state state--empty">
          <div className="state__icon">
            <WalletIcon width={28} height={28} />
          </div>
          <h3>You need an account first</h3>
          <p>Open an account on your dashboard before sending money.</p>
          <Link className="btn btn--primary" to="/dashboard">
            Go to dashboard
          </Link>
        </div>
      ) : (
        <div className="transfer-grid">
          <form className="card transfer-form" onSubmit={handleSubmit} noValidate>
            {/* Source account */}
            <div className="field">
              <label className="field__label" htmlFor="fromAccount">
                From account
              </label>
              <div className="field__control">
                <select
                  id="fromAccount"
                  name="fromAccount"
                  className="field__input"
                  value={form.fromAccount}
                  onChange={update}
                >
                  {fromOptions.map((a) => (
                    <option key={a._id} value={a._id}>
                      {shortId(a._id)} ·{" "}
                      {balances[a._id] != null ? formatMoney(balances[a._id], a.currency) : "…"}
                    </option>
                  ))}
                </select>
              </div>
              {errors.fromAccount && (
                <span className="field__msg field__msg--error">{errors.fromAccount}</span>
              )}
              {selectedBalance != null && (
                <span className="field__msg">
                  Available: {formatMoney(selectedBalance)}
                </span>
              )}
            </div>

            <Field
              label="To account (ID)"
              name="toAccount"
              placeholder="Paste the recipient's account ID"
              value={form.toAccount}
              onChange={update}
              error={errors.toAccount}
            />

            <Field
              label="Amount"
              name="amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.amount}
              onChange={update}
              error={errors.amount}
            />

            <div className="transfer-note">
              <span>⏳</span>
              <p>Processing can take up to ~15 seconds while the ledger is settled. Please keep this tab open.</p>
            </div>

            <button className="btn btn--primary btn--block btn--lg" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Spinner size={18} light /> Processing transfer…
                </>
              ) : (
                <>
                  <SendIcon width={18} height={18} /> Send money
                </>
              )}
            </button>
          </form>

          {/* Side panel: live preview / result */}
          <aside className="card transfer-side">
            {result ? (
              result.ok ? (
                <div className="result result--ok">
                  <div className="result__icon">
                    <CheckIcon width={26} height={26} />
                  </div>
                  <h3>Transfer complete</h3>
                  <p className="result__amount">{formatMoney(result.amount)}</p>
                  <div className="result__row">
                    <span>To</span>
                    <code>{shortId(result.toAccount)}</code>
                  </div>
                  {result.transaction?._id && (
                    <div className="result__row">
                      <span>Txn ID</span>
                      <span className="result__id">
                        <code>{shortId(result.transaction._id)}</code>
                        <CopyButton value={result.transaction._id} label="Copy transaction ID" />
                      </span>
                    </div>
                  )}
                  {result.transaction?.status && (
                    <span className="badge badge--success">{result.transaction.status}</span>
                  )}
                </div>
              ) : (
                <div className="result result--fail">
                  <div className="result__icon result__icon--fail">!</div>
                  <h3>Transfer failed</h3>
                  <p>{result.message}</p>
                </div>
              )
            ) : (
              <div className="transfer-preview">
                <h3 className="transfer-preview__title">Transfer preview</h3>
                <div className="transfer-preview__flow">
                  <div className="transfer-preview__node">
                    <span className="transfer-preview__node-label">From</span>
                    <code>{form.fromAccount ? shortId(form.fromAccount) : "—"}</code>
                  </div>
                  <ArrowRightIcon className="transfer-preview__arrow" width={22} height={22} />
                  <div className="transfer-preview__node">
                    <span className="transfer-preview__node-label">To</span>
                    <code>{form.toAccount ? shortId(form.toAccount) : "—"}</code>
                  </div>
                </div>
                <div className="transfer-preview__amount">
                  {form.amount ? formatMoney(Number(form.amount)) : formatMoney(0)}
                </div>
                <p className="transfer-preview__hint">
                  Each transfer is idempotent — a unique key is generated automatically so retries
                  never double-charge.
                </p>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
