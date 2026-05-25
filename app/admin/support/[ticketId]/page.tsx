'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/app/components/DashboardLayout'
import {
  ArrowLeft,
  Send,
  Loader2,
  Clock,
  User,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  History,
  Tag,
  UserCog,
  FileText,
  Lock,
  Paperclip,
  ChevronDown,
  Zap
} from 'lucide-react'

interface TicketMessage {
  id: string
  content: string
  senderType: 'USER' | 'AGENT' | 'SYSTEM'
  isInternal: boolean
  createdAt: string
  agentName?: string
}

interface TicketHistory {
  id: string
  action: string
  oldValue: string | null
  newValue: string | null
  createdAt: string
  performedBy: string
}

interface Agent {
  id: string
  name: string
  email: string
  role: string
}

interface CannedResponse {
  id: string
  title: string
  content: string
  shortcut: string
  category: string
}

interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  description: string
  category: string
  priority: string
  status: string
  userId: string
  userName: string
  userEmail: string
  assignedToId: string | null
  assignedToName: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
  slaDeadline: string | null
  slaBreach: boolean
  messages: TicketMessage[]
  history: TicketHistory[]
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

const priorityColors: Record<string, string> = {
  LOW: 'text-gray-500 bg-gray-50 border-gray-200',
  MEDIUM: 'text-blue-600 bg-blue-50 border-blue-200',
  HIGH: 'text-orange-600 bg-orange-50 border-orange-200',
  URGENT: 'text-red-600 bg-red-50 border-red-200',
  CRITICAL: 'text-red-800 bg-red-100 border-red-300',
}

export default function AdminTicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.ticketId as string
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [cannedResponses, setCannedResponses] = useState<CannedResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [isInternalNote, setIsInternalNote] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showCannedResponses, setShowCannedResponses] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (ticketId) {
      fetchTicket()
      fetchAgents()
      fetchCannedResponses()
    }
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

      if (data.success) {
        setTicket(data.ticket)
      } else {
        setError(data.error || 'Failed to load ticket')
      }
    } catch (error) {
      setError('Failed to load ticket')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/support/agents')
      const data = await response.json()
      if (data.success) {
        setAgents(data.agents)
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    }
  }

  const fetchCannedResponses = async () => {
    try {
      const response = await fetch('/api/support/canned-responses')
      const data = await response.json()
      if (data.success) {
        setCannedResponses(data.responses)
      }
    } catch (error) {
      console.error('Error fetching canned responses:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isSending) return

    try {
      setIsSending(true)
      const response = await fetch(`/api/support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newMessage,
          isInternal: isInternalNote,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setNewMessage('')
        setIsInternalNote(false)
        fetchTicket()
      } else {
        setError(data.error || 'Failed to send message')
      }
    } catch (error) {
      setError('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const handleUpdateTicket = async (updates: Partial<Ticket>) => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/support/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (data.success) {
        fetchTicket()
      } else {
        setError(data.error || 'Failed to update ticket')
      }
    } catch (error) {
      setError('Failed to update ticket')
    } finally {
      setIsUpdating(false)
    }
  }

  const insertCannedResponse = (response: CannedResponse) => {
    setNewMessage(prev => prev + response.content)
    setShowCannedResponses(false)
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !ticket) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error || 'Ticket not found'}</p>
          <Link
            href="/admin/support"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Back to Support Dashboard
          </Link>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/support"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <span>{ticket.ticketNumber}</span>
              <span>•</span>
              <span>{ticket.category.replace(/_/g, ' ')}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{ticket.subject}</h1>
          </div>
          {ticket.slaBreach && (
            <div className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              SLA Breached
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Messages */}
          <div className="lg:col-span-2 space-y-6">
            {/* Original Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{ticket.userName}</p>
                  <p className="text-sm text-gray-500">{ticket.userEmail}</p>
                </div>
                <span className="ml-auto text-sm text-gray-500">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
            </div>

            {/* Messages */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Conversation ({ticket.messages.length})
                </h2>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                >
                  <History className="w-4 h-4" />
                  {showHistory ? 'Hide History' : 'Show History'}
                </button>
              </div>

              {/* History Panel */}
              {showHistory && ticket.history.length > 0 && (
                <div className="bg-gray-50 border-b border-gray-200 p-4 max-h-48 overflow-y-auto">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Ticket History</h3>
                  <div className="space-y-2">
                    {ticket.history.map((entry) => (
                      <div key={entry.id} className="text-sm">
                        <span className="text-gray-500">
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                        <span className="mx-2">-</span>
                        <span className="text-gray-700">{entry.action}</span>
                        {entry.oldValue && entry.newValue && (
                          <span className="text-gray-500">
                            : {entry.oldValue} → {entry.newValue}
                          </span>
                        )}
                        <span className="text-gray-400 ml-2">by {entry.performedBy}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages List */}
              <div className="max-h-[400px] overflow-y-auto p-4 space-y-4">
                {ticket.messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No messages yet</p>
                ) : (
                  ticket.messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg ${
                        message.isInternal
                          ? 'bg-yellow-50 border border-yellow-200'
                          : message.senderType === 'USER'
                          ? 'bg-gray-100'
                          : message.senderType === 'SYSTEM'
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-green-50 border border-green-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {message.isInternal && (
                            <Lock className="w-4 h-4 text-yellow-600" />
                          )}
                          <span className="font-medium text-gray-900">
                            {message.senderType === 'USER'
                              ? ticket.userName
                              : message.senderType === 'SYSTEM'
                              ? 'System'
                              : message.agentName || 'Support Agent'}
                          </span>
                          {message.isInternal && (
                            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                              Internal Note
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Form */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleSendMessage}>
                  <div className="mb-3 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isInternalNote}
                        onChange={(e) => setIsInternalNote(e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                      />
                      <Lock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Internal Note</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowCannedResponses(!showCannedResponses)}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
                      >
                        <Zap className="w-4 h-4" />
                        Quick Replies
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {showCannedResponses && cannedResponses.length > 0 && (
                        <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                          {cannedResponses.map((response) => (
                            <button
                              key={response.id}
                              type="button"
                              onClick={() => insertCannedResponse(response)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                            >
                              <p className="font-medium text-sm text-gray-900">{response.title}</p>
                              <p className="text-xs text-gray-500 truncate">{response.content}</p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder={isInternalNote ? "Add internal note (not visible to customer)..." : "Type your reply..."}
                      rows={3}
                      className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                        isInternalNote ? 'bg-yellow-50 border-yellow-300' : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || isSending}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 self-end ${
                        isInternalNote
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Sidebar - Ticket Details */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Ticket Details</h3>
              
              <div className="space-y-4">
                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleUpdateTicket({ status: e.target.value })}
                    disabled={isUpdating}
                    className={`w-full p-2 border rounded-lg ${statusColors[ticket.status]}`}
                  >
                    <option value="OPEN">Open</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="WAITING_ON_CUSTOMER">Waiting on Customer</option>
                    <option value="WAITING_ON_THIRD_PARTY">Waiting on Third Party</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => handleUpdateTicket({ priority: e.target.value })}
                    disabled={isUpdating}
                    className={`w-full p-2 border rounded-lg ${priorityColors[ticket.priority]}`}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>

                {/* Assigned Agent */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <select
                    value={ticket.assignedToId || ''}
                    onChange={(e) => handleUpdateTicket({ assignedToId: e.target.value || null })}
                    disabled={isUpdating}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Unassigned</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">{ticket.userName}</p>
                <p className="text-sm text-gray-600">{ticket.userEmail}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-900">{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Updated</span>
                  <span className="text-gray-900">{new Date(ticket.updatedAt).toLocaleString()}</span>
                </div>
                {ticket.resolvedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Resolved</span>
                    <span className="text-gray-900">{new Date(ticket.resolvedAt).toLocaleString()}</span>
                  </div>
                )}
                {ticket.slaDeadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">SLA Deadline</span>
                    <span className={ticket.slaBreach ? 'text-red-600 font-medium' : 'text-gray-900'}>
                      {new Date(ticket.slaDeadline).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && (
                  <button
                    onClick={() => handleUpdateTicket({ status: 'RESOLVED' })}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Mark Resolved
                  </button>
                )}
                {ticket.status === 'RESOLVED' && (
                  <button
                    onClick={() => handleUpdateTicket({ status: 'CLOSED' })}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    Close Ticket
                  </button>
                )}
                {(ticket.status === 'RESOLVED' || ticket.status === 'CLOSED') && (
                  <button
                    onClick={() => handleUpdateTicket({ status: 'REOPENED' })}
                    disabled={isUpdating}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Reopen Ticket
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
