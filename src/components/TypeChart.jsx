import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

// Occupied vs available reads as a fill/track pair (one hue, two steps),
// not two unrelated categorical identities — same logic as a meter.
export default function TypeChart({ byType }) {
  const chartData = byType.map((entry) => ({
    spaceType: entry.spaceType,
    Occupied: entry.occupied,
    Available: entry.available,
  }))

  return (
    <div className="chart-card">
      <h2>Occupied vs available by space type</h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="spaceType"
            tickLine={false}
            axisLine={{ stroke: 'var(--baseline)' }}
            tick={{ fill: 'var(--text-secondary)', fontSize: 13 }}
          />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 12 }} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'var(--available)', fillOpacity: 0.1 }}
            contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6 }}
            labelStyle={{ color: 'var(--text-primary)' }}
          />
          <Legend wrapperStyle={{ fontSize: 13, color: 'var(--text-secondary)' }} />
          <Bar dataKey="Occupied" stackId="spaces" fill="var(--occupied)" radius={[0, 0, 0, 0]} maxBarSize={64} />
          <Bar dataKey="Available" stackId="spaces" fill="var(--available)" radius={[4, 4, 0, 0]} maxBarSize={64} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
