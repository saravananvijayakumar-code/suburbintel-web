'use client'

import { useState } from 'react'

export type BuyerPersona = 
  | 'first-home-buyer'
  | 'investor-growth'
  | 'investor-yield'
  | 'upsizer'
  | 'downsizer'
  | 'lifestyle'
  | 'renovator'

interface PersonaOption {
  id: BuyerPersona
  name: string
  icon: string
  description: string
  color: string
}

const personas: PersonaOption[] = [
  {
    id: 'first-home-buyer',
    name: 'First Home Buyer',
    icon: '🏠',
    description: 'Looking for an affordable first home with good growth potential',
    color: 'from-green-400 to-green-600'
  },
  {
    id: 'investor-growth',
    name: 'Growth Investor',
    icon: '📈',
    description: 'Seeking capital gains with medium-high risk tolerance',
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'investor-yield',
    name: 'Yield Investor',
    icon: '💰',
    description: 'Focused on rental income and cash flow',
    color: 'from-purple-400 to-purple-600'
  },
  {
    id: 'upsizer',
    name: 'Upsizer',
    icon: '👨‍👩‍👧‍👦',
    description: 'Growing family needing more space and family amenities',
    color: 'from-amber-400 to-amber-600'
  },
  {
    id: 'downsizer',
    name: 'Downsizer',
    icon: '🏡',
    description: 'Seeking smaller, low-maintenance property in established area',
    color: 'from-cyan-400 to-cyan-600'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle Seeker',
    icon: '🌴',
    description: 'Prioritizing lifestyle, amenities, and location over investment returns',
    color: 'from-pink-400 to-pink-600'
  },
  {
    id: 'renovator',
    name: 'Renovator',
    icon: '🔨',
    description: 'Looking for renovation opportunities to add value',
    color: 'from-orange-400 to-orange-600'
  }
]

interface PersonaSelectorProps {
  value?: BuyerPersona
  onChange: (persona: BuyerPersona) => void
  label?: string
  showDescription?: boolean
}

export default function PersonaSelector({
  value,
  onChange,
  label = 'Select Your Investment Profile',
  showDescription = true
}: PersonaSelectorProps) {
  const [selected, setSelected] = useState<BuyerPersona | undefined>(value)

  const handleSelect = (persona: BuyerPersona) => {
    setSelected(persona)
    onChange(persona)
  }

  return (
    <div className="w-full">
      {label && (
        <h3 className="text-xl font-bold text-gray-900 mb-6">{label}</h3>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {personas.map((persona) => {
          const isSelected = selected === persona.id

          return (
            <button
              key={persona.id}
              onClick={() => handleSelect(persona.id)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                ${isSelected 
                  ? 'border-blue-500 shadow-xl scale-105 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-102 bg-white'
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className={`
                text-5xl mb-4 p-4 rounded-xl bg-gradient-to-br ${persona.color}
                inline-block
              `}>
                {persona.icon}
              </div>

              {/* Name */}
              <h4 className="text-lg font-bold text-gray-900 mb-2">
                {persona.name}
              </h4>

              {/* Description */}
              {showDescription && (
                <p className="text-sm text-gray-600 leading-relaxed">
                  {persona.description}
                </p>
              )}
            </button>
          )
        })}
      </div>

      {/* Selected Persona Summary */}
      {selected && (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {personas.find(p => p.id === selected)?.icon}
            </div>
            <div>
              <h4 className="font-bold text-lg text-gray-900">
                You selected: {personas.find(p => p.id === selected)?.name}
              </h4>
              <p className="text-gray-700">
                {personas.find(p => p.id === selected)?.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Export persona metadata for use in other components
export { personas }
export type { PersonaOption }
