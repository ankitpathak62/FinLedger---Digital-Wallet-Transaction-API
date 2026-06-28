export default function Spinner({ size = 20, stroke = 2.5, light = false }) {
  return (
    <span
      className={`spinner ${light ? "spinner--light" : ""}`}
      style={{ width: size, height: size, borderWidth: stroke }}
      aria-hidden="true"
    />
  )
}
