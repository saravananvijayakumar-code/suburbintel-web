/**
 * Data Completeness Badge
 * 
 * Shows users if a suburb has complete data, basic data, or is coming soon.
 * Displayed on suburb cards in search results.
 */

import { DataCompleteness, DATA_COMPLETENESS_CONFIG } from '@/lib/constants/coverage';

interface DataCompletenessBadgeProps {
  level: DataCompleteness;
  variant?: 'default' | 'compact';
}

export function DataCompletenessBadge({ 
  level, 
  variant = 'default' 
}: DataCompletenessBadgeProps) {
  const config = DATA_COMPLETENESS_CONFIG[level];
  
  const colorClasses = {
    green: 'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200'
  };
  
  if (variant === 'compact') {
    return (
      <span 
        className={`
          inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border
          ${colorClasses[config.badge_color as keyof typeof colorClasses]}
        `}
        title={config.description}
      >
        {config.icon}
      </span>
    );
  }
  
  return (
    <div 
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
        ${colorClasses[config.badge_color as keyof typeof colorClasses]}
      `}
      title={config.description}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
}
