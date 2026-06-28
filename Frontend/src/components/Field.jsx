import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "./icons"

export default function Field({
  label,
  type = "text",
  hint,
  error,
  id,
  className = "",
  ...props
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword ? (show ? "text" : "password") : type
  const fieldId = id || props.name

  return (
    <div className={`field ${error ? "field--error" : ""} ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="field__label">
          {label}
        </label>
      )}
      <div className="field__control">
        <input id={fieldId} type={inputType} className="field__input" {...props} />
        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setShow((s) => !s)}
            tabIndex={-1}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOffIcon width={18} height={18} /> : <EyeIcon width={18} height={18} />}
          </button>
        )}
      </div>
      {error ? (
        <span className="field__msg field__msg--error">{error}</span>
      ) : hint ? (
        <span className="field__msg">{hint}</span>
      ) : null}
    </div>
  )
}
