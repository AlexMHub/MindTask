const LOCATIONS = ['Berlin', 'Warsaw', 'Miami']
const SPACE_TYPES = ['Hot Desk', 'Dedicated Desk', 'Private Office']

export default function Filters({ filters, onChange }) {
  return (
    <div className="filters">
      <label className="filters__field">
        <span>Location</span>
        <select
          value={filters.location}
          onChange={(e) => onChange({ ...filters, location: e.target.value })}
        >
          <option value="">All locations</option>
          {LOCATIONS.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </label>

      <label className="filters__field">
        <span>Space type</span>
        <select
          value={filters.type}
          onChange={(e) => onChange({ ...filters, type: e.target.value })}
        >
          <option value="">All types</option>
          {SPACE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
