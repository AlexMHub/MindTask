const ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

function salesforceId(prefix) {
  let suffix = ''
  for (let i = 0; i < 15; i++) {
    suffix += ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)]
  }
  return `${prefix}${suffix}`
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const SPACE_TYPES = [
  { name: 'Hot Desk', priceRange: [200, 450], occupancyMultiplier: 0.85 },
  { name: 'Dedicated Desk', priceRange: [450, 800], occupancyMultiplier: 1.0 },
  { name: 'Private Office', priceRange: [800, 1500], occupancyMultiplier: 1.18 },
]

const LOCATIONS = [
  {
    name: 'Berlin',
    city: 'Berlin, DE',
    baseOccupancy: 0.92,
    companySuffixes: ['GmbH', 'GmbH & Co. KG', 'AG'],
  },
  {
    name: 'Warsaw',
    city: 'Warsaw, PL',
    baseOccupancy: 0.8,
    companySuffixes: ['Sp. z o.o.', 'S.A.'],
  },
  {
    name: 'Miami',
    city: 'Miami, FL',
    baseOccupancy: 0.68,
    companySuffixes: ['LLC', 'Inc.', 'Co.'],
  },
]

const COMPANY_NAMES = [
  'Brightpath', 'Nordlight', 'Vantage', 'Cobalt Row', 'Meridian', 'Solace',
  'Kindling', 'Fernwood', 'Anchorage', 'Lucid', 'Greystone', 'Harbor & Co',
  'Northbeam', 'Palisade', 'Rowan', 'Silvermark', 'Tidepool', 'Verdant',
  'Wayfinder', 'Amberlane', 'Cascade Studio', 'Driftwood', 'Elmtree',
  'Farroe', 'Glasswing', 'Hollowcrest', 'Ironbridge', 'Junction',
  'Kestrel', 'Lantern Works', 'Marlowe', 'Novaspring', 'Outpost',
  'Pinehollow', 'Quietstorm', 'Redwing', 'Stonecroft', 'Thistledown',
  'Underline', 'Vellum',
]

function occupantName(location) {
  const base = pick(COMPANY_NAMES)
  const suffix = pick(location.companySuffixes)
  return `${base} ${suffix}`
}

function spaceName(type, floor, sequence) {
  if (type === 'Hot Desk') return `Open-Desk-${sequence}`
  if (type === 'Dedicated Desk') return `Fixed-Desk-${sequence}`
  return `${floor}F-Office-${sequence}`
}

function shuffledIndices(count) {
  const indices = Array.from({ length: count }, (_, i) => i)
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  return indices
}

function generateSpacesForLocation(location, locationId) {
  const spaces = []
  const totalCapacity = randomInt(60, 150)
  const typeCounts = {
    'Hot Desk': Math.round(totalCapacity * 0.45),
    'Dedicated Desk': Math.round(totalCapacity * 0.35),
    'Private Office': totalCapacity - Math.round(totalCapacity * 0.45) - Math.round(totalCapacity * 0.35),
  }

  let sequence = 1
  for (const spaceType of SPACE_TYPES) {
    const count = typeCounts[spaceType.name]
    const occupancyProbability = Math.min(0.98, location.baseOccupancy * spaceType.occupancyMultiplier)
    
    const occupiedQuota = Math.round(count * occupancyProbability)
    const occupiedIndices = new Set(shuffledIndices(count).slice(0, occupiedQuota))

    for (let i = 0; i < count; i++) {
      const isOccupied = occupiedIndices.has(i)
      const [min, max] = spaceType.priceRange
      const monthlyPrice = randomInt(min, max)
      const floor = randomInt(1, 5)

      spaces.push({
        Id: salesforceId('a01'),
        Name: spaceName(spaceType.name, floor, sequence),
        Location__c: locationId,
        Space_Type__c: spaceType.name,
        Status__c: isOccupied ? 'Occupied' : 'Available',
        Monthly_Price__c: monthlyPrice,
        occupantName: isOccupied ? occupantName(location) : null,
      })
      sequence++
    }
  }

  return { spaces, totalCapacity }
}

function buildMockData() {
  const locations = []
  const spaces = []

  for (const location of LOCATIONS) {
    const locationId = salesforceId('a00')
    const { spaces: locationSpaces, totalCapacity } = generateSpacesForLocation(location, locationId)

    locations.push({
      Id: locationId,
      Name: location.name,
      City: location.city,
      Total_Capacity__c: totalCapacity,
    })
    spaces.push(...locationSpaces)
  }

  return { locations, spaces }
}

let cachedData = null

export function generateMockData() {
  if (!cachedData) {
    cachedData = buildMockData()
  }
  return cachedData
}
