/**
 * Data Provenance Tag Component
 * 
 * Shows users where data comes from and when it was last updated.
 * This builds trust and separates us from competitors who hide data sources.
 * 
 * Usage:
 * <DataProvenanceTag
 *   source="nsw_valgen"
 *   lastUpdated="2024-12-01"
 *   confidence="official"
 * />
 */

import { 
  DataSource, 
  DataConfidence, 
  DATA_SOURCE_LABELS, 
  CONFIDENCE_CONFIG 
} from '@/lib/types/data-provenance';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';

interface DataProvenanceTagProps {
  source: DataSource;
  lastUpdated: string;  // ISO date string
  confidence: DataConfidence;
  methodologyUrl?: string;
  notes?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;  // Show full label or just icon
}

export function DataProvenanceTag({
  source,
  lastUpdated,
  confidence,
  methodologyUrl,
  notes,
  size = 'sm',
  showLabel = true
}: DataProvenanceTagProps) {
  const config = CONFIDENCE_CONFIG[confidence];
  const sourceLabel = DATA_SOURCE_LABELS[source];
  
  // Format date
  const formattedDate = new Date(lastUpdated).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: undefined
  });
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5'
  };
  
  const tagContent = (
    <div className={`
      inline-flex items-center gap-1.5 rounded-md border
      ${config.bg_color} ${config.border_color} ${config.text_color}
      ${sizeClasses[size]}
      transition-all hover:shadow-sm cursor-help
    `}>
      <span className="font-semibold">{config.icon}</span>
      {showLabel && (
        <span className="font-medium whitespace-nowrap">
          {sourceLabel}
        </span>
      )}
    </div>
  );
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          {tagContent}
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-3"
        >
          <div className="space-y-2">
            <div>
              <p className="font-semibold text-sm">{sourceLabel}</p>
              <p className="text-xs text-slate-600 mt-0.5">
                {config.label}
              </p>
            </div>
            
            <div className="border-t border-slate-200 pt-2 space-y-1">
              <p className="text-xs">
                <span className="text-slate-600">Last updated:</span>{' '}
                <span className="font-medium">{formattedDate}</span>
              </p>
              
              {notes && (
                <p className="text-xs text-slate-600 italic">
                  {notes}
                </p>
              )}
              
              {confidence === 'modelled' && methodologyUrl && (
                <Link 
                  href={methodologyUrl}
                  className="text-xs text-blue-600 hover:text-blue-800 underline block mt-2"
                >
                  View methodology →
                </Link>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/**
 * Compact version for tight spaces (icon only)
 */
export function DataProvenanceIcon({
  source,
  lastUpdated,
  confidence,
  methodologyUrl,
  notes
}: Omit<DataProvenanceTagProps, 'size' | 'showLabel'>) {
  return (
    <DataProvenanceTag
      source={source}
      lastUpdated={lastUpdated}
      confidence={confidence}
      methodologyUrl={methodologyUrl}
      notes={notes}
      size="sm"
      showLabel={false}
    />
  );
}

/**
 * Full version with data freshness indicator
 */
export function DataProvenanceWithFreshness({
  source,
  lastUpdated,
  confidence,
  methodologyUrl,
  notes
}: DataProvenanceTagProps) {
  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  let freshnessIndicator: { color: string; label: string } = {
    color: 'text-green-600',
    label: 'Fresh'
  };
  
  if (daysSinceUpdate > 90) {
    freshnessIndicator = { color: 'text-orange-600', label: 'Dated' };
  } else if (daysSinceUpdate > 30) {
    freshnessIndicator = { color: 'text-yellow-600', label: 'Recent' };
  }
  
  return (
    <div className="flex items-center gap-2">
      <DataProvenanceTag
        source={source}
        lastUpdated={lastUpdated}
        confidence={confidence}
        methodologyUrl={methodologyUrl}
        notes={notes}
      />
      <span className={`text-xs ${freshnessIndicator.color}`}>
        {freshnessIndicator.label}
      </span>
    </div>
  );
}
