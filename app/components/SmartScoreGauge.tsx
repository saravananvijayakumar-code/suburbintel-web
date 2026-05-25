/**
 * Smart Property Score Gauge - Apple-style Radial Progress
 * 
 * A beautiful radial gauge showing the Smart Property Score (0-100)
 * with color-coded ratings and smooth animations.
 */

'use client'

import { useEffect, useState } from 'react'

interface SmartScoreGaugeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  animated?: boolean
}

export default function SmartScoreGauge({
  score,
  size = 'md',
  showLabel = true,
  animated = true
}: SmartScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0)
  
  useEffect(() => {
    if (animated) {
      let current = 0
      const increment = score / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= score) {
          setDisplayScore(score)
          clearInterval(timer)
        } else {
          setDisplayScore(Math.floor(current))
        }
      }, 20)
      return () => clearInterval(timer)
    } else {
      setDisplayScore(score)
    }
  }, [score, animated])
  
  const getScoreData = (score: number) => {
    if (score >= 85) {
      return {
        rating: 'A+',
        label: 'Excellent',
        color: 'emerald',
        gradient: 'from-emerald-500 to-green-600',
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        ring: 'ring-emerald-200',
        description: 'Outstanding investment opportunity'
      }
    } else if (score >= 75) {
      return {
        rating: 'A',
        label: 'Very Good',
        color: 'green',
        gradient: 'from-green-500 to-emerald-600',
        bg: 'bg-green-50',
        text: 'text-green-700',
        ring: 'ring-green-200',
        description: 'Strong investment opportunity'
      }
    } else if (score >= 65) {
      return {
        rating: 'B+',
        label: 'Good',
        color: 'blue',
        gradient: 'from-blue-500 to-cyan-600',
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        ring: 'ring-blue-200',
        description: 'Solid investment choice'
      }
    } else if (score >= 55) {
      return {
        rating: 'B',
        label: 'Above Average',
        color: 'cyan',
        gradient: 'from-cyan-500 to-blue-600',
        bg: 'bg-cyan-50',
        text: 'text-cyan-700',
        ring: 'ring-cyan-200',
        description: 'Reasonable investment'
      }
    } else if (score >= 45) {
      return {
        rating: 'C+',
        label: 'Average',
        color: 'yellow',
        gradient: 'from-yellow-500 to-amber-600',
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        ring: 'ring-yellow-200',
        description: 'Mixed signals'
      }
    } else if (score >= 35) {
      return {
        rating: 'C',
        label: 'Below Average',
        color: 'orange',
        gradient: 'from-orange-500 to-amber-600',
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        ring: 'ring-orange-200',
        description: 'Proceed with caution'
      }
    } else {
      return {
        rating: 'D',
        label: 'Poor',
        color: 'red',
        gradient: 'from-red-500 to-rose-600',
        bg: 'bg-red-50',
        text: 'text-red-700',
        ring: 'ring-red-200',
        description: 'Not recommended'
      }
    }
  }
  
  const scoreData = getScoreData(score)
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (displayScore / 100) * circumference
  
  const sizeClasses = {
    sm: { container: 'w-32 h-32', text: 'text-2xl', label: 'text-xs', rating: 'text-sm' },
    md: { container: 'w-48 h-48', text: 'text-4xl', label: 'text-sm', rating: 'text-lg' },
    lg: { container: 'w-64 h-64', text: 'text-5xl', label: 'text-base', rating: 'text-xl' }
  }
  
  const classes = sizeClasses[size]
  
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Radial Gauge */}
      <div className={`relative ${classes.container}`}>
        {/* Background Circle */}
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="54"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress Circle */}
          <circle
            cx="50%"
            cy="50%"
            r="54"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className={`${scoreData.color === 'emerald' ? 'stop-emerald-500' : 
                scoreData.color === 'green' ? 'stop-green-500' :
                scoreData.color === 'blue' ? 'stop-blue-500' :
                scoreData.color === 'cyan' ? 'stop-cyan-500' :
                scoreData.color === 'yellow' ? 'stop-yellow-500' :
                scoreData.color === 'orange' ? 'stop-orange-500' : 'stop-red-500'}`} />
              <stop offset="100%" className={`${scoreData.color === 'emerald' ? 'stop-green-600' : 
                scoreData.color === 'green' ? 'stop-emerald-600' :
                scoreData.color === 'blue' ? 'stop-cyan-600' :
                scoreData.color === 'cyan' ? 'stop-blue-600' :
                scoreData.color === 'yellow' ? 'stop-amber-600' :
                scoreData.color === 'orange' ? 'stop-amber-600' : 'stop-rose-600'}`} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`font-bold ${classes.text} bg-gradient-to-br ${scoreData.gradient} bg-clip-text text-transparent`}>
            {displayScore}
          </div>
          <div className={`${classes.rating} font-semibold ${scoreData.text} mt-1`}>
            {scoreData.rating}
          </div>
        </div>
      </div>
      
      {/* Label */}
      {showLabel && (
        <div className="text-center">
          <div className={`font-bold text-gray-900 ${classes.label}`}>Smart Property Score</div>
          <div className={`${scoreData.text} font-semibold mt-1`}>{scoreData.label}</div>
          <div className="text-xs text-gray-600 mt-1">{scoreData.description}</div>
        </div>
      )}
    </div>
  )
}
