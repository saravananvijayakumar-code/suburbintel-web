/**
 * Infrastructure Timeline - Future projects and developments
 */

'use client'

import { Calendar, CheckCircle, Clock, Construction, Train, Building2 } from 'lucide-react'

interface InfrastructureProject {
  name: string
  type: 'transport' | 'commercial' | 'residential' | 'public' | 'mixed-use'
  status: 'completed' | 'under-construction' | 'planned' | 'confirmed'
  completionDate?: string
  impact: 'high' | 'medium' | 'low'
  distanceKm?: number
}

interface InfrastructureTimelineProps {
  projects: InfrastructureProject[]
}

export default function InfrastructureTimeline({ projects }: InfrastructureTimelineProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transport': return <Train className="w-5 h-5" />
      case 'commercial': return <Building2 className="w-5 h-5" />
      case 'residential': return <Building2 className="w-5 h-5" />
      case 'public': return <Construction className="w-5 h-5" />
      default: return <Construction className="w-5 h-5" />
    }
  }
  
  const getStatusData = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'green',
          bg: 'from-green-500 to-emerald-600',
          label: 'Completed'
        }
      case 'under-construction':
        return {
          icon: <Construction className="w-5 h-5" />,
          color: 'blue',
          bg: 'from-blue-500 to-cyan-600',
          label: 'Under Construction'
        }
      case 'confirmed':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'purple',
          bg: 'from-purple-500 to-indigo-600',
          label: 'Confirmed'
        }
      default:
        return {
          icon: <Clock className="w-5 h-5" />,
          color: 'gray',
          bg: 'from-gray-500 to-gray-600',
          label: 'Planned'
        }
    }
  }
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-700 border-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      default: return 'bg-blue-100 text-blue-700 border-blue-300'
    }
  }
  
  // Sort by status priority: completed > under-construction > confirmed > planned
  const sortedProjects = [...projects].sort((a, b) => {
    const priority = { completed: 0, 'under-construction': 1, confirmed: 2, planned: 3 }
    return priority[a.status] - priority[b.status]
  })
  
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
          <Construction className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Infrastructure Pipeline</h3>
          <p className="text-sm text-gray-600">Future developments & projects</p>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
          <div className="text-sm text-gray-600">Completed</div>
          <div className="text-2xl font-bold text-gray-900">
            {projects.filter(p => p.status === 'completed').length}
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <Construction className="w-5 h-5 text-blue-600 mb-2" />
          <div className="text-sm text-gray-600">In Progress</div>
          <div className="text-2xl font-bold text-gray-900">
            {projects.filter(p => p.status === 'under-construction').length}
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
          <Calendar className="w-5 h-5 text-purple-600 mb-2" />
          <div className="text-sm text-gray-600">Confirmed</div>
          <div className="text-2xl font-bold text-gray-900">
            {projects.filter(p => p.status === 'confirmed').length}
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200">
          <Clock className="w-5 h-5 text-gray-600 mb-2" />
          <div className="text-sm text-gray-600">Planned</div>
          <div className="text-2xl font-bold text-gray-900">
            {projects.filter(p => p.status === 'planned').length}
          </div>
        </div>
      </div>
      
      {/* Timeline */}
      <div className="space-y-4">
        {sortedProjects.map((project, index) => {
          const statusData = getStatusData(project.status)
          
          return (
            <div
              key={index}
              className="relative pl-8 pb-6 border-l-2 border-gray-200 last:border-l-0 last:pb-0 group hover:border-blue-300 transition"
            >
              {/* Timeline Dot */}
              <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br ${statusData.bg} flex items-center justify-center shadow-lg ring-4 ring-white`}>
                {statusData.icon}
              </div>
              
              {/* Project Card */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-200 group-hover:border-blue-300 group-hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${statusData.bg.replace('500', '100').replace('600', '200')} text-${statusData.color}-700`}>
                        {getTypeIcon(project.type)}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{project.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${statusData.bg} text-white font-semibold`}>
                            {statusData.label}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getImpactColor(project.impact)} font-semibold uppercase`}>
                            {project.impact} Impact
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  {project.completionDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{project.completionDate}</span>
                    </div>
                  )}
                  {project.distanceKm !== undefined && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{project.distanceKm} km</span>
                      <span>from suburb</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <span className="capitalize">{project.type.replace('-', ' ')}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {projects.length === 0 && (
        <div className="text-center py-12">
          <Construction className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No infrastructure projects currently listed for this area</p>
        </div>
      )}
    </div>
  )
}
