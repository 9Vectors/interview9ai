/**
 * VectorScoreGrid — Score cards for Interview9.ai active vectors
 * People, Strategy, Execution, Expectations
 *
 * Part of TheGreyMatter.ai Platform — 9Vectors Integration
 */

import {
  Users,
  Target,
  Zap,
  ClipboardCheck,
} from 'lucide-react'

const VECTOR_ICONS = {
  People: Users,
  Strategy: Target,
  Execution: Zap,
  Expectations: ClipboardCheck,
}

const VECTOR_COLORS = {
  People: '#10B981',
  Strategy: '#8B5CF6',
  Execution: '#EC4899',
  Expectations: '#14B8A6',
}

function getScoreLabel(score) {
  if (score === null || score === undefined) return { label: 'No Data', tier: 'none' }
  if (score >= 80) return { label: 'Strong', tier: 'high' }
  if (score >= 60) return { label: 'Good', tier: 'good' }
  if (score >= 40) return { label: 'Developing', tier: 'medium' }
  return { label: 'Needs Focus', tier: 'low' }
}

const TIER_STYLES = {
  high: 'text-emerald-600 bg-emerald-50',
  good: 'text-blue-600 bg-blue-50',
  medium: 'text-amber-600 bg-amber-50',
  low: 'text-red-600 bg-red-50',
  none: 'text-slate-400 bg-slate-100',
}

function VectorCard({ vectorData }) {
  const Icon = VECTOR_ICONS[vectorData.vector] || Target
  const color = VECTOR_COLORS[vectorData.vector] || '#666'
  const { label, tier } = getScoreLabel(vectorData.score)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{vectorData.vector}</h4>
            <span className="text-xs text-slate-500 capitalize">{vectorData.domain}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color }}>
            {vectorData.score}
            <span className="text-xs font-normal text-slate-400">%</span>
          </div>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${vectorData.score}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-xs">
        <span className={`px-2 py-0.5 rounded-full font-medium ${TIER_STYLES[tier]}`}>
          {label}
        </span>
        <span className="text-slate-500">
          {vectorData.evidenceCount} evidence
        </span>
      </div>

      {/* Sub-vectors */}
      {vectorData.subVectors && vectorData.subVectors.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
          {vectorData.subVectors.map((sv) => (
            <div key={sv.name} className="flex items-center justify-between text-xs">
              <span className="text-slate-600 truncate mr-2">{sv.name}</span>
              <span className="font-medium text-slate-700">{sv.score}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function VectorScoreGrid({ vectors = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {vectors.map((v) => (
        <VectorCard key={v.vector} vectorData={v} />
      ))}
    </div>
  )
}
