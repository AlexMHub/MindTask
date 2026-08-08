import { generateMockData } from './_mockData.js'

const SPACE_SAMPLE_LIMIT = 50

function summarize(spaces) {
  const totalSpaces = spaces.length
  const occupied = spaces.filter((s) => s.Status__c === 'Occupied').length
  const available = totalSpaces - occupied
  const occupancyRate = totalSpaces === 0 ? 0 : occupied / totalSpaces
  return { totalSpaces, occupied, available, occupancyRate }
}

function groupBy(spaces, key) {
  const groups = new Map()
  for (const space of spaces) {
    const groupKey = space[key]
    if (!groups.has(groupKey)) groups.set(groupKey, [])
    groups.get(groupKey).push(space)
  }
  return groups
}

function matches(fieldValue, filterValue) {
  return fieldValue.trim().toLowerCase() === filterValue.trim().toLowerCase()
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { locations, spaces } = generateMockData()
    const locationById = new Map(locations.map((l) => [l.Id, l]))

    const decodePlus = (value) => value?.replace(/\+/g, ' ')
    const locationFilter = decodePlus(req.query.location)
    const typeFilter = decodePlus(req.query.type)

    let filteredSpaces = spaces
    if (locationFilter) {
      filteredSpaces = filteredSpaces.filter((s) => {
        const name = locationById.get(s.Location__c)?.Name
        return name && matches(name, locationFilter)
      })
    }
    if (typeFilter) {
      filteredSpaces = filteredSpaces.filter((s) => matches(s.Space_Type__c, typeFilter))
    }

    const summary = summarize(filteredSpaces)

    const byLocation = locations
      .map((location) => {
        const locationSpaces = filteredSpaces.filter((s) => s.Location__c === location.Id)
        return { location: location.Name, ...summarize(locationSpaces) }
      })
      .filter((entry) => entry.totalSpaces > 0)

    const byType = Array.from(groupBy(filteredSpaces, 'Space_Type__c'), ([spaceType, group]) => ({
      spaceType,
      ...summarize(group),
    }))

    const sampleSpaces = filteredSpaces.slice(0, SPACE_SAMPLE_LIMIT).map((space) => ({
      id: space.Id,
      name: space.Name,
      location: locationById.get(space.Location__c)?.Name ?? 'Unknown',
      type: space.Space_Type__c,
      status: space.Status__c,
      monthlyPrice: space.Monthly_Price__c,
      occupantName: space.occupantName,
    }))

    const instanceUrl = process.env.SALESFORCE_INSTANCE_URL ?? 'not configured'

    res.status(200).json({
      summary,
      byLocation,
      byType,
      spaces: sampleSpaces,
      meta: {
        source: `Salesforce org: ${instanceUrl}`,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to load occupancy data', detail: error.message })
  }
}
