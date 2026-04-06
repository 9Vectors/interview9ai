/**
 * VectorRadarChart — Active vector radar chart for Interview9.ai
 * Displays the 4 active vectors (People, Strategy, Execution, Expectations)
 * color-coded by domain.
 *
 * Part of TheGreyMatter.ai Platform — 9Vectors Integration
 */

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const VECTOR_META = {
  People:       { domain: 'assets',     color: '#10B981' },
  Strategy:     { domain: 'processes',  color: '#8B5CF6' },
  Execution:    { domain: 'processes',  color: '#EC4899' },
  Expectations: { domain: 'structures', color: '#14B8A6' },
}

const DOMAIN_COLORS = {
  assets:     '#10B981',
  processes:  '#8B5CF6',
  structures: '#14B8A6',
}

function CustomTick({ payload, x, y, textAnchor }) {
  const meta = VECTOR_META[payload.value]
  const color = meta ? meta.color : '#666'

  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      fill={color}
      fontSize={13}
      fontWeight={600}
    >
      {payload.value}
    </text>
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload
  const meta = VECTOR_META[data.vector]

  return (
    <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: meta?.color || '#666' }}
        />
        <span className="text-sm font-semibold text-slate-900">{data.vector}</span>
      </div>
      <div className="text-xs text-slate-500 mb-1 capitalize">{meta?.domain} domain</div>
      <div className="text-lg font-bold text-teal-700">
        {data.score}%
      </div>
      {data.evidenceCount !== undefined && (
        <div className="text-xs text-slate-500 mt-1">
          {data.evidenceCount} evidence items
        </div>
      )}
    </div>
  )
}

export default function VectorRadarChart({ vectors = [], size = 'default' }) {
  const radarData = vectors.map(v => ({
    vector: v.vector,
    score: v.score,
    fullMark: 100,
    evidenceCount: v.evidenceCount,
  }))

  const height = size === 'compact' ? 260 : 320

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
          <PolarGrid stroke="rgba(100, 116, 139, 0.15)" />
          <PolarAngleAxis dataKey="vector" tick={<CustomTick />} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#999' }}
            tickCount={5}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#1e6b8c"
            fill="#1e6b8c"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>

      {/* Domain legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-2">
        {Object.entries(DOMAIN_COLORS).map(([domain, color]) => (
          <div key={domain} className="flex items-center gap-1.5 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-slate-500 capitalize">{domain}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
