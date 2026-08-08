function formatPercent(rate) {
  return `${Math.round(rate * 100)}%`
}

export default function SummaryCards({ summary }) {
  const cards = [
    { label: 'Total spaces', value: summary.totalSpaces },
    { label: 'Occupied', value: summary.occupied },
    { label: 'Available', value: summary.available },
    { label: 'Occupancy rate', value: formatPercent(summary.occupancyRate) },
  ]

  return (
    <div className="summary-cards">
      {cards.map((card) => (
        <div className="stat-tile" key={card.label}>
          <span className="stat-tile__label">{card.label}</span>
          <span className="stat-tile__value">{card.value}</span>
        </div>
      ))}
    </div>
  )
}
