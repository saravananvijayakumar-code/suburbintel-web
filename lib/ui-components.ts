/**
 * World-Class Visual Components Library
 * Enterprise-Grade UI/UX for PDF Reports and Chat Responses
 * 
 * Usage: Import these HTML templates into your prompts for consistent,
 * beautiful formatting across all AI-generated content.
 */

export const DESIGN_SYSTEM = {
  colors: {
    primary: '#1e40af',
    primaryLight: '#3b82f6',
    success: '#059669',
    successLight: '#10b981',
    warning: '#d97706',
    warningLight: '#f59e0b',
    danger: '#dc2626',
    dangerLight: '#ef4444',
    lightGray: '#f8fafc',
    borderGray: '#e2e8f0',
    textDark: '#1e293b',
    textMedium: '#64748b',
  },
  
  icons: {
    metrics: '📊',
    price: '💰',
    growth: '📈',
    decline: '📉',
    house: '🏠',
    unit: '🏢',
    rent: '💵',
    score: '🎯',
    risk: '⚠️',
    good: '✅',
    poor: '❌',
    alert: '🔔',
    family: '👨‍👩‍👧‍👦',
    investor: '💼',
    student: '🎓',
    premium: '🌟',
    key: '🔑',
    location: '📍',
    transport: '🚇',
    schools: '🏫',
    calendar: '📅',
    search: '🔍',
    insight: '💡',
    chart: '📉',
    trending: '🔥',
    safe: '🛡️',
  }
}

/**
 * METRIC CARD - For displaying key numbers
 * Use for: Median Price, Rental Yield, Population, etc.
 */
export const metricCard = (icon: string, label: string, value: string, change?: string, changeColor?: string) => `
<div style="display:inline-block;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);padding:24px;border-radius:14px;border-left:5px solid #1e40af;margin:12px;min-width:220px;box-shadow:0 2px 8px rgba(30,64,175,0.1);">
  <div style="font-size:13px;color:#64748b;text-transform:uppercase;font-weight:700;letter-spacing:1px;margin-bottom:10px;">${icon} ${label}</div>
  <div style="font-size:32px;font-weight:800;color:#1e40af;margin-bottom:6px;line-height:1;">${value}</div>
  ${change ? `<div style="font-size:14px;color:${changeColor || '#059669'};font-weight:600;">${change}</div>` : ''}
</div>`

/**
 * PROGRESS BAR - For displaying scores/percentages
 * Use for: Investment Score, Risk Score, Completeness, etc.
 */
export const progressBar = (label: string, value: number, max: number = 100, color?: string) => {
  const percentage = (value / max) * 100
  const barColor = color || (percentage >= 70 ? '#059669' : percentage >= 40 ? '#d97706' : '#dc2626')
  const barGradient = percentage >= 70 ? 'linear-gradient(90deg,#059669 0%,#10b981 100%)' : 
                       percentage >= 40 ? 'linear-gradient(90deg,#d97706 0%,#f59e0b 100%)' : 
                       'linear-gradient(90deg,#dc2626 0%,#ef4444 100%)'
  
  return `
<div style="margin:18px 0;">
  <div style="display:flex;justify-content:space-between;margin-bottom:10px;align-items:center;">
    <span style="font-weight:700;color:#1e293b;font-size:15px;">${label}</span>
    <span style="font-weight:800;color:${barColor};font-size:18px;">${value}/${max}</span>
  </div>
  <div style="background:#e2e8f0;border-radius:12px;height:14px;overflow:hidden;box-shadow:inset 0 2px 4px rgba(0,0,0,0.06);">
    <div style="background:${barGradient};height:100%;width:${percentage}%;border-radius:12px;transition:width 0.3s ease;"></div>
  </div>
</div>`
}

/**
 * BADGE PILL - For status indicators
 * Use for: BUY/HOLD/SELL, High/Medium/Low, etc.
 */
export const badge = (text: string, variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' = 'info') => {
  const variants = {
    success: { bg: '#059669', color: 'white' },
    warning: { bg: '#d97706', color: 'white' },
    danger: { bg: '#dc2626', color: 'white' },
    info: { bg: '#1e40af', color: 'white' },
    neutral: { bg: '#64748b', color: 'white' },
  }
  const style = variants[variant]
  return `<span style="background:${style.bg};color:${style.color};padding:6px 14px;border-radius:20px;font-size:12px;font-weight:700;margin-right:8px;display:inline-block;letter-spacing:0.5px;">${text}</span>`
}

/**
 * PROFESSIONAL TABLE - For data presentation
 * Use for: Metrics comparison, suburb data, financial breakdown
 */
export const professionalTable = (headers: string[], rows: string[][]) => {
  const headerRow = headers.map(h => `<th style="padding:16px;text-align:left;color:white;font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">${h}</th>`).join('')
  const bodyRows = rows.map(row => `
    <tr style="background:#ffffff;border-bottom:1px solid #e2e8f0;transition:background 0.2s;">
      ${row.map((cell, idx) => `<td style="padding:14px;color:${idx === 0 ? '#1e293b' : '#64748b'};font-weight:${idx === 0 ? '600' : '500'};">${cell}</td>`).join('')}
    </tr>
  `).join('')
  
  return `
<table style="width:100%;border-collapse:collapse;margin:24px 0;box-shadow:0 4px 16px rgba(0,0,0,0.08);border-radius:12px;overflow:hidden;">
  <thead>
    <tr style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);">
      ${headerRow}
    </tr>
  </thead>
  <tbody>
    ${bodyRows}
  </tbody>
</table>`
}

/**
 * HIGHLIGHT BOX - For key insights or warnings
 * Use for: Important findings, risks, opportunities
 */
export const highlightBox = (title: string, content: string, variant: 'info' | 'warning' | 'success' | 'danger' = 'info') => {
  const variants = {
    info: { bg: 'linear-gradient(135deg,#dbeafe 0%,#bfdbfe 100%)', border: '#1e40af', text: '#1e3a8a', icon: '💡' },
    warning: { bg: 'linear-gradient(135deg,#fef3c7 0%,#fde68a 100%)', border: '#d97706', text: '#92400e', icon: '⚠️' },
    success: { bg: 'linear-gradient(135deg,#d1fae5 0%,#a7f3d0 100%)', border: '#059669', text: '#065f46', icon: '✅' },
    danger: { bg: 'linear-gradient(135deg,#fee2e2 0%,#fecaca 100%)', border: '#dc2626', text: '#991b1b', icon: '🔴' },
  }
  const style = variants[variant]
  
  return `
<div style="background:${style.bg};border-left:5px solid ${style.border};padding:24px;border-radius:10px;margin:24px 0;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
  <div style="font-weight:800;color:${style.text};font-size:17px;margin-bottom:12px;">${style.icon} ${title}</div>
  <p style="color:${style.text};line-height:1.7;margin:0;font-size:15px;">${content}</p>
</div>`
}

/**
 * SCENARIO CARD - For base/upside/downside scenarios
 * Use for: Investment scenarios, projections
 */
export const scenarioCard = (title: string, content: string, variant: 'upside' | 'base' | 'downside') => {
  const variants = {
    upside: { bg: 'linear-gradient(135deg,#dcfce7 0%,#bbf7d0 100%)', border: '#059669', color: '#059669', icon: '📈' },
    base: { bg: 'linear-gradient(135deg,#e0f2fe 0%,#bfdbfe 100%)', border: '#3b82f6', color: '#1e40af', icon: '📊' },
    downside: { bg: 'linear-gradient(135deg,#fee2e2 0%,#fecaca 100%)', border: '#dc2626', color: '#dc2626', icon: '📉' },
  }
  const style = variants[variant]
  
  return `
<div style="background:${style.bg};padding:24px;border-radius:14px;border-top:5px solid ${style.border};box-shadow:0 2px 12px rgba(0,0,0,0.08);min-height:180px;">
  <div style="font-weight:800;color:${style.color};font-size:19px;margin-bottom:14px;">${style.icon} ${title}</div>
  <div style="color:#1e293b;line-height:1.7;font-size:14px;">${content}</div>
</div>`
}

/**
 * PREMIUM HEADER - For report cover page
 * Use for: PDF report header
 */
export const premiumHeader = (title: string, subtitle: string, metadata: { label: string, value: string, icon: string }[]) => {
  const metadataCards = metadata.map(m => `
    <div style="background:rgba(255,255,255,0.25);backdrop-filter:blur(10px);padding:14px 22px;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">
      <div style="color:rgba(255,255,255,0.95);font-size:11px;margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">${m.label}</div>
      <div style="color:#ffffff;font-weight:800;font-size:17px;">${m.icon} ${m.value}</div>
    </div>
  `).join('')
  
  return `
<div style="background:linear-gradient(135deg,#1e40af 0%,#3b82f6 100%);padding:50px;border-radius:18px;margin-bottom:50px;box-shadow:0 12px 48px rgba(30,64,175,0.35);">
  <div style="color:rgba(255,255,255,0.95);font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:3px;margin-bottom:14px;">Smart Property Brain Report</div>
  <h1 style="color:#ffffff;font-size:48px;font-weight:900;margin:0 0 24px 0;line-height:1.1;text-shadow:0 2px 8px rgba(0,0,0,0.1);">${title}</h1>
  ${subtitle ? `<div style="color:rgba(255,255,255,0.9);font-size:18px;margin-bottom:30px;font-weight:500;">${subtitle}</div>` : ''}
  <div style="display:flex;gap:20px;flex-wrap:wrap;">
    ${metadataCards}
  </div>
</div>`
}

/**
 * DATA QUALITY INDICATOR - Shows completeness with visual bar
 * Use for: Section 9 of PDF report
 */
export const dataQualityIndicator = (score: number, availableFields: string[], missingFields: string[]) => {
  const scoreColor = score >= 80 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626'
  const scoreGradient = score >= 80 ? 'linear-gradient(90deg,#059669 0%,#10b981 100%)' : 
                         score >= 50 ? 'linear-gradient(90deg,#d97706 0%,#f59e0b 100%)' : 
                         'linear-gradient(90deg,#dc2626 0%,#ef4444 100%)'
  
  return `
<div style="background:#f0f9ff;border:3px solid #bfdbfe;padding:30px;border-radius:14px;box-shadow:0 2px 12px rgba(30,64,175,0.1);">
  <div style="font-size:20px;font-weight:800;color:#1e40af;margin-bottom:18px;">🔍 Completeness Score: ${score}/100</div>
  <div style="background:#ffffff;border-radius:12px;height:24px;overflow:hidden;margin-bottom:24px;border:2px solid #bfdbfe;box-shadow:inset 0 2px 4px rgba(0,0,0,0.06);">
    <div style="background:${scoreGradient};height:100%;width:${score}%;border-radius:10px;"></div>
  </div>
  
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
    <div>
      <div style="font-weight:700;color:#059669;margin-bottom:12px;font-size:15px;">✅ Available Data (${availableFields.length})</div>
      <ul style="margin:0;padding-left:20px;color:#1e293b;line-height:1.8;">
        ${availableFields.map(f => `<li style="margin:4px 0;">${f}</li>`).join('')}
      </ul>
    </div>
    <div>
      <div style="font-weight:700;color:#dc2626;margin-bottom:12px;font-size:15px;">❌ Missing Data (${missingFields.length})</div>
      <ul style="margin:0;padding-left:20px;color:#64748b;line-height:1.8;">
        ${missingFields.map(f => `<li style="margin:4px 0;">${f}</li>`).join('')}
      </ul>
    </div>
  </div>
</div>`
}

/**
 * CHAT CITATION FOOTER - For chat responses
 * Use for: End of every chat response
 */
export const chatCitationFooter = (usedSources: string[], missingSources: string[], nextQuestion?: string) => `
<div style="margin-top:30px;padding-top:24px;border-top:2px solid #e2e8f0;font-family:system-ui,-apple-system,sans-serif;">
  <div style="font-size:13px;color:#64748b;margin-bottom:10px;line-height:1.6;">
    <strong style="color:#1e293b;">📚 What I used:</strong> ${usedSources.join(', ') || 'General knowledge'}
  </div>
  ${missingSources.length > 0 ? `
  <div style="font-size:13px;color:#64748b;margin-bottom:14px;line-height:1.6;">
    <strong style="color:#1e293b;">❓ What's missing:</strong> ${missingSources.join(', ')}
  </div>
  ` : ''}
  ${nextQuestion ? `
  <div style="background:#f8fafc;padding:16px;border-radius:8px;margin-top:14px;border-left:3px solid #1e40af;">
    <div style="font-size:12px;color:#64748b;margin-bottom:8px;font-weight:600;">💡 Suggested next question:</div>
    <div style="font-size:14px;color:#1e40af;font-weight:600;line-height:1.5;">"${nextQuestion}"</div>
  </div>
  ` : ''}
</div>`

// Export all templates as a single object
export const UI_COMPONENTS = {
  metricCard,
  progressBar,
  badge,
  professionalTable,
  highlightBox,
  scenarioCard,
  premiumHeader,
  dataQualityIndicator,
  chatCitationFooter,
}
