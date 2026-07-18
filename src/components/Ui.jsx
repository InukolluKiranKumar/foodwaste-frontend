export function StatusBadge({ status }) {
  if (!status) return null
  return <span className={`badge ${status}`}>{status}</span>
}

export function Loader({ text = 'Loading…' }) {
  return <p className="loader">{text}</p>
}

export function Notice({ type = 'error', children }) {
  if (!children) return null
  return <div className={`notice ${type}`}>{children}</div>
}

export function EmptyState({ children }) {
  return <div className="empty-state">{children}</div>
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
