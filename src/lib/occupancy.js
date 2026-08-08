// The client never talks to Salesforce (or knows it exists) — it only ever
// calls our own /api/occupancy endpoint and trusts the server to have
// already handled data source and filtering.
export async function fetchOccupancy({ location, type } = {}, signal) {
  const params = new URLSearchParams()
  if (location) params.set('location', location)
  if (type) params.set('type', type)
  const query = params.toString()

  const response = await fetch(`/api/occupancy${query ? `?${query}` : ''}`, { signal })
  if (!response.ok) {
    throw new Error(`Occupancy request failed (${response.status})`)
  }
  return response.json()
}
