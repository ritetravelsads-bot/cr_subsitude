"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Shield, 
  Send,
  Calendar,
  Tag,
  MessageSquare
} from "lucide-react"

export default function AdminTicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [ticket, setTicket] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [replyMessage, setReplyMessage] = useState("")
  const [newStatus, setNewStatus] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const res = await fetch(`/api/admin/tickets/${id}`)
        const data = await res.json()
        setTicket(data)
        setNewStatus(data.status || "open")
      } catch (error) {
        console.error("Error loading ticket:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTicket()
  }, [id])

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/admin/tickets/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: replyMessage,
          status: newStatus,
        }),
      })

      if (res.ok) {
        // Reload ticket to get updated replies
        const ticketRes = await fetch(`/api/admin/tickets/${id}`)
        const ticketData = await ticketRes.json()
        setTicket(ticketData)
        setReplyMessage("")
      }
    } catch (error) {
      console.error("Error submitting reply:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      high: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    }
    return colors[priority] || "bg-muted text-muted-foreground"
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      in_progress: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      closed: "bg-muted text-muted-foreground",
    }
    return colors[status] || "bg-muted text-muted-foreground"
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
      case "closed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
        <Skeleton className="h-40" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/tickets"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </Link>
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted-foreground">Ticket not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tickets"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">{ticket.subject}</h1>
            <p className="text-sm text-muted-foreground">Ticket ID: {ticket._id}</p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Tag className="h-4 w-4" />
            <span className="text-xs">Status</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(ticket.status)}
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}>
              {ticket.status.replace("_", " ")}
            </span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs">Priority</span>
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority}
          </span>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Created</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {new Date(ticket.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <User className="h-4 w-4" />
            <span className="text-xs">Agent</span>
          </div>
          <p className="text-sm font-medium text-foreground truncate">
            {ticket.customer_name || ticket.user?.email || "Unknown"}
          </p>
        </div>
      </div>

      {/* Category & Original Message */}
      {ticket.category && (
        <div className="bg-muted/30 border border-border rounded-lg p-3">
          <span className="text-xs text-muted-foreground">Category: </span>
          <span className="text-xs font-medium text-foreground capitalize">{ticket.category.replace("_", " ")}</span>
        </div>
      )}

      {/* Conversation Thread */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Conversation</h2>
          </div>
        </div>

        <div className="divide-y divide-border">
          {/* Original Message */}
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                <User className="h-4 w-4 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-foreground">
                    {ticket.customer_name || "Agent"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(ticket.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </div>
          </div>

          {/* Replies */}
          {ticket.replies &&
            ticket.replies.map((reply: any, index: number) => (
              <div key={index} className={`p-4 ${reply.from === "admin" ? "bg-primary/5" : ""}`}>
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      reply.from === "admin"
                        ? "bg-primary/10"
                        : "bg-blue-500/10"
                    }`}
                  >
                    {reply.from === "admin" ? (
                      <Shield className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm text-foreground">
                        {reply.from === "admin" ? "Admin" : ticket.customer_name || "Agent"}
                      </span>
                      {reply.from === "admin" && (
                        <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded">
                          Staff
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(reply.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{reply.message}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Reply Form */}
      {ticket.status !== "closed" && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="font-semibold text-foreground mb-4">Send Reply</h3>
          <form onSubmit={handleSubmitReply} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Update Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full md:w-auto px-3 py-2 text-sm border border-border rounded-lg bg-input focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Reply Message
              </label>
              <textarea
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type your response to the agent..."
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-input focus:outline-none focus:ring-1 focus:ring-ring resize-none h-32"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting || !replyMessage.trim()}>
                {submitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {ticket.status === "closed" && (
        <div className="bg-muted/30 border border-border rounded-lg p-4 text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">This ticket has been closed</p>
        </div>
      )}
    </div>
  )
}
