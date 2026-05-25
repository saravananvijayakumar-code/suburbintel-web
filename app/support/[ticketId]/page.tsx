'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/app/components/DashboardLayout'
import {
  ArrowLeft,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Headphones,
  Paperclip,
  Loader2,
  Tag,
  Calendar,
  MessageSquare,
  AlertTriangle,
  XCircle,
  RefreshCw
} from 'lucide-react'

interface TicketMessage {
  id: string
  content: string
  senderName: string
  senderRole: 'USER' | 'AGENT' | 'SYSTEM'
  isInternal: boolean
  createdAt: string
}

interface TicketDetails {
  id: string
  ticketNumber: string
  subject: string
  description: string
  category: string
  priority: string
  status: string
  userName: string
  userEmail: string
  assignedToName: string | null
  createdAt: string
  updatedAt: string
  slaDeadline: string | null
  slaBreach: boolean
  messages: TicketMessage[]
}

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  WAITING_ON_CUSTOMER: 'bg-orange-100 text-orange-800',
  WAITING_ON_THIRD_PARTY: 'bg-purple-100 text-purple-800',
  RESOLVED: 'bg-green-100 text-green-800',
  CLOSED: 'bg-gray-100 text-gray-800',
  REOPENED: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  WAITING_ON_CUSTOMER: 'Waiting on You',
  WAITING_ON_THIRD_PARTY: 'Waiting on Third Party',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REOPENED: 'Reopened',
}

const priorityColors: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-700',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-orange-100 text-orange-700',
  URGENT: 'bg-red-100 text-red-700',
  CRITICAL: 'bg-red-200 text-red-800',
}

const categoryLabels: Record<string, string> = {
  GENERAL: 'General',
  BILLING: 'Billing',
  TECHNICAL: 'Technical',
  ACCOUNT: 'Account',
  DATA_QUALITY: 'Data Quality',
  FEATURE_REQUEST: 'Feature Request',
  BUG_REPORT: 'Bug Report',
  SUBSCRIPTION: 'Subscription',
  API: 'API',
  OTHER: 'Other',
}

export default function TicketDetailPage() {
  const { ticketId } = useParams()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [ticket, setTicket] = useState<TicketDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTicket()
  }, [ticketId])

  useEffect(() => {
    scrollToBottom()
  }, [ticket?.messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchTicket = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/support/tickets/${ticketId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ticket')
      }

      setTicket(data.ticket)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setIsSending(true)
    setError('')

    try {
      const response = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setNewMessage('')
      fetchTicket() // Refresh to get new message
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (!ticket) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The ticket you are looking for does not exist.'}</p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Support
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  const isResolved = ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/support"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-500">{ticket.ticketNumber}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[ticket.status]}`}>
                {statusLabels[ticket.status]}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[ticket.priority]}`}>
                {ticket.priority}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>
          </div>
          <button
            onClick={fetchTicket}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Ticket Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Category</span>
              <p className="font-medium">{categoryLabels[ticket.category]}</p>
            </div>
            <div>
              <span className="text-gray-500">Created</span>
              <p className="font-medium">{new Date(ticket.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-gray-500">Assigned To</span>
              <p className="font-medium">{ticket.assignedToName || 'Unassigned'}</p>
            </div>
            <div>
              <span className="text-gray-500">Last Updated</span>
              <p className="font-medium">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          {ticket.slaDeadline && !isResolved && (
            <div className={`mt-4 p-3 rounded-lg ${ticket.slaBreach ? 'bg-red-50' : 'bg-blue-50'}`}>
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${ticket.slaBreach ? 'text-red-500' : 'text-blue-500'}`} />
                <span className={`text-sm ${ticket.slaBreach ? 'text-red-700' : 'text-blue-700'}`}>
                  {ticket.slaBreach 
                    ? 'SLA breached - We apologize for the delay'
                    : `Expected response by ${new Date(ticket.slaDeadline).toLocaleString()}`
                  }
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Conversation
            </h2>
          </div>
          
          <div className="p-4 space-y-4 max-h-[500px] overflow-y-auto">
            {ticket.messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.senderRole === 'USER' ? '' : 'flex-row-reverse'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.senderRole === 'USER' 
                    ? 'bg-blue-100' 
                    : message.senderRole === 'AGENT'
                    ? 'bg-green-100'
                    : 'bg-gray-100'
                }`}>
                  {message.senderRole === 'USER' ? (
                    <User className="w-4 h-4 text-blue-600" />
                  ) : message.senderRole === 'AGENT' ? (
                    <Headphones className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`flex-1 ${message.senderRole === 'USER' ? '' : 'text-right'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {message.senderName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
                    message.senderRole === 'USER'
                      ? 'bg-blue-50 text-gray-800'
                      : message.senderRole === 'AGENT'
                      ? 'bg-green-50 text-gray-800'
                      : 'bg-gray-100 text-gray-600 italic'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Reply Form */}
        {!isResolved ? (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSendMessage}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <div className="flex justify-between items-center mt-3">
                <p className="text-xs text-gray-500">
                  {newMessage.length}/10000 characters
                </p>
                <button
                  type="submit"
                  disabled={isSending || !newMessage.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">This ticket is {ticket.status.toLowerCase()}</h3>
            <p className="text-gray-600 text-sm mb-4">
              If you need further assistance, you can reply to reopen this ticket.
            </p>
            <button
              onClick={() => {
                // Allow reopening by showing reply form
                setTicket(prev => prev ? { ...prev, status: 'REOPENED' } : null)
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <MessageSquare className="w-4 h-4" />
              Reply to Reopen
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
