import { AlertTriangle, Droplet, Flame, Shield, AlertCircle } from 'lucide-react'

export type RiskLevel = 'low' | 'medium' | 'high' | 'unknown'
export type RiskType = 'flood' | 'bushfire' | 'crime' | 'overall'

interface RiskBadgeProps {
  type: RiskType
  level: RiskLevel
  label?: string
  compact?: boolean
  showIcon?: boolean
  className?: string
}

const riskConfig = {
  flood: {
    icon: Droplet,
    labels: {
      low: 'Low Flood Risk',
      medium: 'Moderate Flood Risk',
      high: 'High Flood Risk',
      unknown: 'Flood Risk Unknown'
    },
    colors: {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-red-100 text-red-800 border-red-300',
      unknown: 'bg-gray-100 text-gray-600 border-gray-300'
    },
    emojis: {
      low: '✓',
      medium: '⚠',
      high: '⚠',
      unknown: '?'
    }
  },
  bushfire: {
    icon: Flame,
    labels: {
      low: 'Low Bushfire Risk',
      medium: 'Moderate Bushfire Risk',
      high: 'High Bushfire Risk',
      unknown: 'Bushfire Risk Unknown'
    },
    colors: {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-orange-100 text-orange-800 border-orange-300',
      high: 'bg-red-100 text-red-800 border-red-300',
      unknown: 'bg-gray-100 text-gray-600 border-gray-300'
    },
    emojis: {
      low: '✓',
      medium: '⚠',
      high: '🔥',
      unknown: '?'
    }
  },
  crime: {
    icon: Shield,
    labels: {
      low: 'Safe Area',
      medium: 'Moderate Crime',
      high: 'High Crime Area',
      unknown: 'Crime Data Unknown'
    },
    colors: {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-red-100 text-red-800 border-red-300',
      unknown: 'bg-gray-100 text-gray-600 border-gray-300'
    },
    emojis: {
      low: '✓',
      medium: '⚠',
      high: '⚠',
      unknown: '?'
    }
  },
  overall: {
    icon: AlertTriangle,
    labels: {
      low: 'Low Risk',
      medium: 'Moderate Risk',
      high: 'High Risk',
      unknown: 'Risk Unknown'
    },
    colors: {
      low: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      high: 'bg-red-100 text-red-800 border-red-300',
      unknown: 'bg-gray-100 text-gray-600 border-gray-300'
    },
    emojis: {
      low: '✓',
      medium: '⚠',
      high: '⚠',
      unknown: '?'
    }
  }
}

export function RiskBadge({ 
  type, 
  level, 
  label, 
  compact = false, 
  showIcon = true,
  className = '' 
}: RiskBadgeProps) {
  const config = riskConfig[type]
  const Icon = config.icon
  const displayLabel = label || config.labels[level]
  const colorClasses = config.colors[level]
  const emoji = config.emojis[level]

  if (compact) {
    return (
      <span 
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${colorClasses} ${className}`}
        title={displayLabel}
      >
        <span>{emoji}</span>
        {label && <span>{label}</span>}
      </span>
    )
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold border ${colorClasses} ${className}`}>
      {showIcon && <Icon className="w-4 h-4" />}
      <span>{emoji}</span>
      <span>{displayLabel}</span>
    </div>
  )
}

interface RiskSummaryProps {
  flood: RiskLevel
  bushfire: RiskLevel
  crime: RiskLevel
  className?: string
}

export function RiskSummary({ flood, bushfire, crime, className = '' }: RiskSummaryProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <RiskBadge type="flood" level={flood} compact />
      <RiskBadge type="bushfire" level={bushfire} compact />
      <RiskBadge type="crime" level={crime} compact />
    </div>
  )
}

interface DetailedRiskCardProps {
  type: RiskType
  level: RiskLevel
  description?: string
  details?: string[]
  sourceLink?: string
  className?: string
}

export function DetailedRiskCard({ 
  type, 
  level, 
  description, 
  details,
  sourceLink,
  className = '' 
}: DetailedRiskCardProps) {
  const config = riskConfig[type]
  const Icon = config.icon
  const colorClasses = config.colors[level]
  const displayLabel = config.labels[level]

  // Determine border color based on risk level
  const borderColor = level === 'high' ? 'border-red-300' : 
                      level === 'medium' ? 'border-yellow-300' : 
                      level === 'low' ? 'border-green-300' : 
                      'border-gray-300'

  // Determine background gradient
  const bgGradient = level === 'high' ? 'from-red-50 to-red-100' : 
                     level === 'medium' ? 'from-yellow-50 to-yellow-100' : 
                     level === 'low' ? 'from-green-50 to-green-100' : 
                     'from-gray-50 to-gray-100'

  return (
    <div className={`bg-gradient-to-br ${bgGradient} border-2 ${borderColor} rounded-xl p-6 ${className}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-lg ${config.colors[level]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{displayLabel}</h3>
          {description && (
            <p className="text-sm text-gray-700">{description}</p>
          )}
        </div>
        <RiskBadge type={type} level={level} compact showIcon={false} />
      </div>

      {details && details.length > 0 && (
        <ul className="space-y-2 mb-4">
          {details.map((detail, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-gray-400 mt-0.5">•</span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}

      {sourceLink && (
        <a 
          href={sourceLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          View detailed risk map →
        </a>
      )}
    </div>
  )
}
