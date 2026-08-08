export default function StatusBanner({ status, error, onRetry }) {
  if (status === 'loading') {
    return <div className="status-banner status-banner--loading">Loading occupancy data…</div>
  }

  if (status === 'error') {
    return (
      <div className="status-banner status-banner--error">
        <span>Couldn't load occupancy data{error ? `: ${error}` : '.'}</span>
        <button type="button" onClick={onRetry}>
          Retry
        </button>
      </div>
    )
  }

  return null
}
