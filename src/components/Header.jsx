export default function Header({ source }) {
  return (
    <header className="app-header">
      <h1>Occupancy Dashboard</h1>
      {source && <p className="app-header__source">{source}</p>}
    </header>
  )
}
