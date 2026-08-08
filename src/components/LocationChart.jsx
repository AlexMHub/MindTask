import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// Comparing one magnitude (occupancy rate) across locations → bar chart,
// single sequential hue. No legend needed for a single series; the tooltip
// and direct bar-top labels carry the value.
export default function LocationChart({ byLocation }) {
  const chartData = byLocation.map((entry) => ({
    location: entry.location,
    occupancyPercent: Math.round(entry.occupancyRate * 100),
  }))

  return (
    <div className="chart-card">
      <h2>Occupancy rate by location</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 24, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="location"
            tickLine={false}
            axisLine={{ stroke: 'var(--baseline)' }}
            tick={{ fill: 'var(--text-secondary)', fontSize: 13 }}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(v) => `${v}%`}
            tickLine={false}
            axisLine={false}
            tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: 'var(--available)', fillOpacity: 0.15 }}
            formatter={(value) => [`${value}%`, 'Occupancy rate']}
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6 }}
            labelStyle={{ color: 'var(--text-primary)' }}
          />
          <Bar dataKey="occupancyPercent" fill="var(--occupied)" radius={[4, 4, 0, 0]} maxBarSize={64}>
            <LabelList dataKey="occupancyPercent" position="top" formatter={(v) => `${v}%`} fill="var(--text-primary)" fontSize={13} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
