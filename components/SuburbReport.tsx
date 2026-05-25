import React from 'react'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Register fonts (optional - using default fonts for now)
// Font.register({
//   family: 'Inter',
//   fonts: [
//     { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2' },
//   ]
// })

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: '#1e40af',
    borderBottomStyle: 'solid',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#374151',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    borderBottomStyle: 'solid',
    paddingBottom: 8,
  },
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  metricCard: {
    width: '48%',
    marginRight: '4%',
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6b7280',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metricChange: {
    fontSize: 12,
    marginTop: 4,
  },
  positiveChange: {
    color: '#059669',
  },
  negativeChange: {
    color: '#dc2626',
  },
  analysis: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0ea5e9',
    borderStyle: 'solid',
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0c4a6e',
    marginBottom: 12,
  },
  analysisText: {
    fontSize: 12,
    lineHeight: 1.6,
    color: '#374151',
  },
  riskSection: {
    marginTop: 20,
  },
  riskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fefefe',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
  },
  riskLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  riskValue: {
    fontSize: 14,
    color: '#6b7280',
  },
  lowRisk: {
    color: '#059669',
  },
  mediumRisk: {
    color: '#d97706',
  },
  highRisk: {
    color: '#dc2626',
  },
  footer: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderTopStyle: 'solid',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  disclaimer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderStyle: 'solid',
  },
  disclaimerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 10,
    color: '#92400e',
    lineHeight: 1.4,
    marginBottom: 6,
  },
})

interface SuburbReportData {
  name: string
  state: string
  postcode: string
  medianPrice: number
  growth12m: number | null
  growth6m: number | null
  growth3m: number | null
  rentalYield: number | null
  investmentScore: number | null
  population: number | null
  medianAge: number | null
  medianIncome: number | null
  floodRisk: 'low' | 'medium' | 'high' | null
  bushfireRisk: 'low' | 'medium' | 'high' | null
  crimeRisk: 'low' | 'medium' | 'high' | null
  analysis: string
  lastUpdated: string
}

interface SuburbReportProps {
  data: SuburbReportData
}

const SuburbReport: React.FC<SuburbReportProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number | null) => {
    if (value === null) return 'N/A'
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case 'low': return styles.lowRisk
      case 'medium': return styles.mediumRisk
      case 'high': return styles.highRisk
      default: return styles.riskValue
    }
  }

  // Strip HTML tags from analysis content for PDF rendering
  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Investment Report</Text>
          <Text style={styles.subtitle}>SuburbIntel Premium Analysis</Text>
          <Text style={styles.location}>
            {data.name}, {data.state} {data.postcode}
          </Text>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Investment Metrics</Text>
          <View style={styles.metricGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Median Price</Text>
              <Text style={styles.metricValue}>{formatCurrency(data.medianPrice)}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>12-Month Growth</Text>
              <Text style={styles.metricValue}>{formatPercent(data.growth12m)}</Text>
              {data.growth12m !== null && (
                <Text style={[styles.metricChange, data.growth12m >= 0 ? styles.positiveChange : styles.negativeChange]}>
                  {data.growth12m >= 0 ? '↗ Growing' : '↘ Declining'}
                </Text>
              )}
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Rental Yield</Text>
              <Text style={styles.metricValue}>{formatPercent(data.rentalYield)}</Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Investment Score</Text>
              <Text style={styles.metricValue}>{data.investmentScore ? `${data.investmentScore}/100` : 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* AI Analysis */}
        <View style={styles.analysis}>
          <Text style={styles.analysisTitle}>🤖 AI Investment Analysis</Text>
          <Text style={styles.analysisText}>{stripHtmlTags(data.analysis)}</Text>
        </View>

        {/* Risk Assessment */}
        <View style={styles.riskSection}>
          <Text style={styles.sectionTitle}>Risk Assessment</Text>

          <View style={styles.riskItem}>
            <Text style={styles.riskLabel}>Flood Risk</Text>
            <Text style={[styles.riskValue, getRiskColor(data.floodRisk)]}>
              {data.floodRisk ? data.floodRisk.toUpperCase() : 'Unknown'}
            </Text>
          </View>

          <View style={styles.riskItem}>
            <Text style={styles.riskLabel}>Bushfire Risk</Text>
            <Text style={[styles.riskValue, getRiskColor(data.bushfireRisk)]}>
              {data.bushfireRisk ? data.bushfireRisk.toUpperCase() : 'Unknown'}
            </Text>
          </View>

          <View style={styles.riskItem}>
            <Text style={styles.riskLabel}>Crime Risk</Text>
            <Text style={[styles.riskValue, getRiskColor(data.crimeRisk)]}>
              {data.crimeRisk ? data.crimeRisk.toUpperCase() : 'Unknown'}
            </Text>
          </View>
        </View>

        {/* Demographics */}
        {(data.population || data.medianAge || data.medianIncome) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Demographics</Text>
            <View style={styles.metricGrid}>
              {data.population && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Population</Text>
                  <Text style={styles.metricValue}>{data.population.toLocaleString()}</Text>
                </View>
              )}

              {data.medianAge && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Median Age</Text>
                  <Text style={styles.metricValue}>{data.medianAge} years</Text>
                </View>
              )}

              {data.medianIncome && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabel}>Median Income</Text>
                  <Text style={styles.metricValue}>{formatCurrency(data.medianIncome)}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by SuburbIntel on {new Date().toLocaleDateString('en-AU')}
          </Text>
          <Text style={styles.footerText}>
            Data last updated: {new Date(data.lastUpdated).toLocaleDateString('en-AU')}
          </Text>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>IMPORTANT LEGAL DISCLAIMER</Text>
          <Text style={styles.disclaimerText}>
            This report is provided for informational and educational purposes only.
            It does not constitute financial advice, investment advice, tax advice,
            legal advice, or any other form of professional advice.
          </Text>
          <Text style={styles.disclaimerText}>
            Property investment involves significant financial risk, including the
            potential loss of your entire investment. Past performance is not indicative
            of future results. Market conditions can change rapidly.
          </Text>
          <Text style={styles.disclaimerText}>
            You should conduct your own research, seek independent professional advice
            from qualified financial advisors, accountants, and legal professionals
            before making any investment decisions.
          </Text>
          <Text style={styles.disclaimerText}>
            SuburbIntel and its affiliates are not responsible for any investment
            decisions made based on this report. All investments carry risk.
          </Text>
          <Text style={styles.disclaimerText}>
            This report is not licensed by ASIC (Australian Securities and Investments Commission)
            and does not meet the requirements for providing financial product advice.
          </Text>
        </View>
      </Page>
    </Document>
  )
}

export default SuburbReport