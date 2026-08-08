import { useEffect, useState } from 'react'
import { fetchOccupancy } from './lib/occupancy'
import Header from './components/Header'
import Filters from './components/Filters'
import StatusBanner from './components/StatusBanner'
import SummaryCards from './components/SummaryCards'
import LocationChart from './components/LocationChart'
import TypeChart from './components/TypeChart'
import SpacesTable from './components/SpacesTable'
import './App.css'

function keyOf(filters, attempt) {
  return `${filters.location}|${filters.type}|${attempt}`
}

function App() {
  const [filters, setFilters] = useState({ location: '', type: '' })
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })

  useEffect(() => {
    const controller = new AbortController()
    const key = keyOf(filters, attempt)

    fetchOccupancy(filters, controller.signal)
      .then((data) => setResult({ key, data, error: null }))
      .catch((err) => {
        if (err.name === 'AbortError') return
        setResult({ key, data: null, error: err.message })
      })

    return () => controller.abort()
  }, [filters, attempt])

  const currentKey = keyOf(filters, attempt)
  const isLoading = result.key !== currentKey
  const status = isLoading ? 'loading' : result.error ? 'error' : 'success'
  const { data, error } = result

  return (
    <div className="app">
      <Header source={data?.meta?.source} />
      <Filters filters={filters} onChange={setFilters} />
      <main className="app-main">
        <StatusBanner status={status} error={error} onRetry={() => setAttempt((a) => a + 1)} />
        {data && (
          <>
            <SummaryCards summary={data.summary} />
            <div className="chart-row">
              <LocationChart byLocation={data.byLocation} />
              <TypeChart byType={data.byType} />
            </div>
            <SpacesTable spaces={data.spaces} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
