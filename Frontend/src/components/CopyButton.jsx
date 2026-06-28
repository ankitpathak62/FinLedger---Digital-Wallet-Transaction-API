import { useState } from "react"
import { CopyIcon, CheckIcon } from "./icons"
import { useToast } from "../context/ToastContext"

export default function CopyButton({ value, label = "Copy", className = "" }) {
  const [copied, setCopied] = useState(false)
  const toast = useToast()

  async function handleCopy(e) {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(String(value))
      setCopied(true)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error("Couldn't copy")
    }
  }

  return (
    <button
      type="button"
      className={`copy-btn ${className}`}
      onClick={handleCopy}
      title={`${label}: ${value}`}
      aria-label={label}
    >
      {copied ? <CheckIcon width={15} height={15} /> : <CopyIcon width={15} height={15} />}
    </button>
  )
}
