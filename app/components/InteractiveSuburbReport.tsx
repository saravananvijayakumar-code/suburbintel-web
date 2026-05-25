'use client'

import React, { useState, useRef } from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer
} from '@react-pdf/renderer'
import {
  FileText,
  Download,
  Share2,
  Eye,
  EyeOff,
  BarChart3,
  TrendingUp,
  MapPin,
  Users,
  DollarSign,
  Home,
  AlertTriangle,
  CheckCircle,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Mail,
  Link as LinkIcon
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts'

// PDF Styles
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
  priceHistory?: Array<{
    month: string
    medianPrice: number
    weeklyRent?: number
  }>
  similarSuburbs?: Array<{
    name: string
    state: string
    medianPrice: number
    growth12m: number | null
    investmentScore: number | null
  }>
}

interface InteractiveSuburbReportProps {
  data: SuburbReportData
  hasProAccess: boolean
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']

// PDF Component
const SuburbReportPDF: React.FC<{ data: SuburbReportData }> = ({ data }) => {
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

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Investment Report</Text>
          <Text style={styles.subtitle}>SuburbIntel Premium Analysis</Text>
          <Text style={styles.location}>
            {data.name}, {data.state} {data.postcode}
          </Text>
        </View>

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

        <View style={styles.analysis}>
          <Text style={styles.analysisTitle}>🤖 AI Investment Analysis</Text>
          <Text style={styles.analysisText}>{stripHtmlTags(data.analysis)}</Text>
        </View>

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

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by SuburbIntel on {new Date().toLocaleDateString('en-AU')}
          </Text>
          <Text style={styles.footerText}>
            Data last updated: {new Date(data.lastUpdated).toLocaleDateString('en-AU')}
          </Text>
        </View>

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

// Main Interactive Component
export default function InteractiveSuburbReport({ data, hasProAccess }: InteractiveSuburbReportProps) {
  const [viewMode, setViewMode] = useState<'web' | 'pdf'>('web')
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'comparison' | 'risk'>('overview')
  const [shareUrl, setShareUrl] = useState('')
  const reportRef = useRef<HTMLDivElement>(null)

  // Prepare chart data
  const priceHistoryData = data.priceHistory?.map(item => ({
    date: new Date(item.month).toLocaleDateString('en-AU', { year: 'numeric', month: 'short' }),
    price: item.medianPrice,
    yield: item.weeklyRent ? ((item.weeklyRent * 52) / item.medianPrice) * 100 : null
  })) || []

  const growthData = [
    { period: '3 Months', growth: data.growth3m, color: '#3b82f6' },
    { period: '6 Months', growth: data.growth6m, color: '#10b981' },
    { period: '12 Months', growth: data.growth12m, color: '#f59e0b' }
  ].filter(item => item.growth !== null)

  const riskData = [
    { name: 'Flood Risk', value: data.floodRisk === 'high' ? 30 : data.floodRisk === 'medium' ? 20 : 10, risk: data.floodRisk },
    { name: 'Bushfire Risk', value: data.bushfireRisk === 'high' ? 30 : data.bushfireRisk === 'medium' ? 20 : 10, risk: data.bushfireRisk },
    { name: 'Crime Risk', value: data.crimeRisk === 'high' ? 30 : data.crimeRisk === 'medium' ? 20 : 10, risk: data.crimeRisk }
  ].filter(item => item.risk !== null)

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
      case 'low': return 'text-green-600 bg-green-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'high': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getRiskIcon = (risk: string | null) => {
    switch (risk) {
      case 'low': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'high': return <X className="h-5 w-5 text-red-600" />
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const copyShareUrl = async () => {
    const url = `${window.location.origin}/suburb/${data.name.toLowerCase().replace(/\s+/g, '-')}-${data.state.toLowerCase()}`
    await navigator.clipboard.writeText(url)
    setShareUrl('Copied!')
    setTimeout(() => setShareUrl(''), 2000)
  }

  const exportAsImage = () => {
    // This would require html2canvas or similar library
    alert('Image export feature coming soon!')
  }

  if (!hasProAccess) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl p-8 border border-indigo-200">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="h-6 w-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-900">Interactive Investment Report</h3>
        </div>
        <p className="text-gray-600 mb-4">
          Generate comprehensive, interactive suburb reports with charts, comparisons, and export options.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/60 p-4 rounded-lg">
            <BarChart3 className="h-5 w-5 text-indigo-600 mb-2" />
            <p className="text-sm font-medium">Interactive Charts</p>
            <p className="text-xs text-gray-600">Price trends, growth analysis, risk visualization</p>
          </div>
          <div className="bg-white/60 p-4 rounded-lg">
            <TrendingUp className="h-5 w-5 text-indigo-600 mb-2" />
            <p className="text-sm font-medium">Comparative Analysis</p>
            <p className="text-xs text-gray-600">Compare with similar suburbs</p>
          </div>
          <div className="bg-white/60 p-4 rounded-lg">
            <Download className="h-5 w-5 text-indigo-600 mb-2" />
            <p className="text-sm font-medium">Multiple Formats</p>
            <p className="text-xs text-gray-600">PDF, image, and shareable links</p>
          </div>
        </div>
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Upgrade to Pro - $14.95/month
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6" />
            <h3 className="text-xl font-bold">Interactive Investment Report</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'web' ? 'pdf' : 'web')}
              className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition"
            >
              {viewMode === 'web' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              {viewMode === 'web' ? 'PDF View' : 'Web View'}
            </button>
            <button
              onClick={copyShareUrl}
              className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition"
            >
              <Share2 className="h-4 w-4" />
              {shareUrl || 'Share'}
            </button>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-indigo-100 text-lg font-semibold">
            {data.name}, {data.state} {data.postcode}
          </p>
          <p className="text-indigo-200 text-sm">
            Generated on {new Date().toLocaleDateString('en-AU')} • Data updated {new Date(data.lastUpdated).toLocaleDateString('en-AU')}
          </p>
        </div>
      </div>

      {viewMode === 'pdf' ? (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">PDF Preview</h4>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPDFPreview(!showPDFPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                {showPDFPreview ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                {showPDFPreview ? 'Minimize' : 'Preview'}
              </button>
              <PDFDownloadLink
                document={<SuburbReportPDF data={data} />}
                fileName={`${data.name}-${data.state}-investment-report.pdf`}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {({ loading }) => (
                  <>
                    <Download className="h-4 w-4" />
                    {loading ? 'Generating...' : 'Download PDF'}
                  </>
                )}
              </PDFDownloadLink>
            </div>
          </div>

          {showPDFPreview && (
            <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                <SuburbReportPDF data={data} />
              </PDFViewer>
            </div>
          )}
        </div>
      ) : (
        <div ref={reportRef}>
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'overview', label: 'Overview', icon: Home },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'comparison', label: 'Comparison', icon: TrendingUp },
                { id: 'risk', label: 'Risk Analysis', icon: AlertTriangle }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition ${
                    activeTab === id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                    <DollarSign className="h-6 w-6 text-blue-600 mb-2" />
                    <div className="text-sm text-blue-700 font-medium">Median Price</div>
                    <div className="text-2xl font-bold text-blue-900">{formatCurrency(data.medianPrice)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                    <TrendingUp className="h-6 w-6 text-green-600 mb-2" />
                    <div className="text-sm text-green-700 font-medium">12M Growth</div>
                    <div className={`text-2xl font-bold ${data.growth12m && data.growth12m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(data.growth12m)}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                    <Home className="h-6 w-6 text-purple-600 mb-2" />
                    <div className="text-sm text-purple-700 font-medium">Rental Yield</div>
                    <div className="text-2xl font-bold text-purple-900">{formatPercent(data.rentalYield)}</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                    <BarChart3 className="h-6 w-6 text-orange-600 mb-2" />
                    <div className="text-sm text-orange-700 font-medium">Investment Score</div>
                    <div className="text-2xl font-bold text-orange-900">
                      {data.investmentScore ? `${data.investmentScore}/100` : 'N/A'}
                    </div>
                  </div>
                </div>

                {/* AI Analysis */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="text-lg font-semibold text-blue-900 mb-4">🤖 AI Investment Analysis</h4>
                  <div className="prose prose-sm max-w-none text-blue-800" dangerouslySetInnerHTML={{ __html: data.analysis }} />
                </div>

                {/* Demographics */}
                {(data.population || data.medianAge || data.medianIncome) && (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">👥 Demographics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {data.population && (
                        <div className="text-center p-4 bg-white rounded-lg">
                          <Users className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 font-medium">Population</div>
                          <div className="text-xl font-bold text-gray-900">{data.population.toLocaleString()}</div>
                        </div>
                      )}
                      {data.medianAge && (
                        <div className="text-center p-4 bg-white rounded-lg">
                          <Users className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 font-medium">Median Age</div>
                          <div className="text-xl font-bold text-gray-900">{data.medianAge} years</div>
                        </div>
                      )}
                      {data.medianIncome && (
                        <div className="text-center p-4 bg-white rounded-lg">
                          <DollarSign className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                          <div className="text-sm text-gray-600 font-medium">Median Income</div>
                          <div className="text-xl font-bold text-gray-900">{formatCurrency(data.medianIncome)}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Price History Chart */}
                {priceHistoryData.length > 0 && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Price History & Trends</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={priceHistoryData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" />
                          <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                          <Tooltip
                            formatter={(value: any) => [formatCurrency(value), 'Median Price']}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Growth Analysis */}
                {growthData.length > 0 && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Growth Performance</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={growthData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="period" />
                          <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                          <Tooltip formatter={(value: any) => [`${value.toFixed(1)}%`, 'Growth']} />
                          <Bar dataKey="growth" fill="#10b981" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Rental Yield Chart */}
                {priceHistoryData.some(d => d.yield) && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Rental Yield Trends</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={priceHistoryData.filter(d => d.yield)}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" />
                          <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} />
                          <Tooltip formatter={(value: any) => [`${value.toFixed(2)}%`, 'Rental Yield']} />
                          <Area type="monotone" dataKey="yield" stroke="#f59e0b" fill="#fef3c7" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Comparison Tab */}
            {activeTab === 'comparison' && data.similarSuburbs && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Comparison with Similar Suburbs</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.similarSuburbs.map((suburb, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <h5 className="font-semibold text-gray-900">{suburb.name}, {suburb.state}</h5>
                      <div className="mt-2 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Median Price:</span>
                          <span className="font-medium">{formatCurrency(suburb.medianPrice)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">12M Growth:</span>
                          <span className={`font-medium ${suburb.growth12m && suburb.growth12m >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercent(suburb.growth12m)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Investment Score:</span>
                          <span className="font-medium">{suburb.investmentScore || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Analysis Tab */}
            {activeTab === 'risk' && (
              <div className="space-y-6">
                <h4 className="text-lg font-semibold text-gray-900">Risk Assessment</h4>

                {/* Risk Factors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg border ${getRiskColor(data.floodRisk)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getRiskIcon(data.floodRisk)}
                      <span className="font-medium">Flood Risk</span>
                    </div>
                    <p className="text-sm capitalize">{data.floodRisk || 'Unknown'}</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${getRiskColor(data.bushfireRisk)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getRiskIcon(data.bushfireRisk)}
                      <span className="font-medium">Bushfire Risk</span>
                    </div>
                    <p className="text-sm capitalize">{data.bushfireRisk || 'Unknown'}</p>
                  </div>
                  <div className={`p-4 rounded-lg border ${getRiskColor(data.crimeRisk)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getRiskIcon(data.crimeRisk)}
                      <span className="font-medium">Crime Risk</span>
                    </div>
                    <p className="text-sm capitalize">{data.crimeRisk || 'Unknown'}</p>
                  </div>
                </div>

                {/* Risk Visualization */}
                {riskData.length > 0 && (
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h5 className="text-md font-semibold text-gray-900 mb-4">Risk Distribution</h5>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={riskData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}%`}
                          >
                            {riskData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Export Options */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Export Options</h4>
              <div className="flex flex-wrap gap-4">
                <PDFDownloadLink
                  document={<SuburbReportPDF data={data} />}
                  fileName={`${data.name}-${data.state}-investment-report.pdf`}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </PDFDownloadLink>
                <button
                  onClick={exportAsImage}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  <Download className="h-4 w-4" />
                  Export as Image
                </button>
                <button
                  onClick={copyShareUrl}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <LinkIcon className="h-4 w-4" />
                  Copy Share Link
                </button>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Important Disclaimer</h5>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>This report is for informational purposes only and does not constitute financial advice.</p>
                <p>Property investment involves significant risk. Past performance does not guarantee future results.</p>
                <p>Always conduct your own research and seek professional advice before making investment decisions.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}