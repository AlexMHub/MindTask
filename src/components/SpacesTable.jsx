function formatPrice(amount) {
  return `$${amount.toLocaleString('en-US')}`
}

export default function SpacesTable({ spaces }) {
  return (
    <div className="chart-card">
      <h2>Spaces</h2>
      {spaces.length === 0 ? (
        <p className="spaces-table-empty">No spaces match this filter.</p>
      ) : (
        <div className="spaces-table-scroll">
          <table className="spaces-table">
            <thead>
              <tr>
                <th>Space</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Monthly price</th>
                <th>Occupant</th>
              </tr>
            </thead>
            <tbody>
              {spaces.map((space) => (
                <tr key={space.id}>
                  <td>{space.name}</td>
                  <td>{space.location}</td>
                  <td>{space.type}</td>
                  <td>
                    <span className={`status-badge status-badge--${space.status.toLowerCase()}`}>
                      {space.status}
                    </span>
                  </td>
                  <td className="spaces-table__price">{formatPrice(space.monthlyPrice)}</td>
                  <td>{space.occupantName ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
