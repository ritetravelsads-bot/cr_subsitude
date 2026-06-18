"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, User, Shield, Send } from "lucide-react"

interface Reply {
  id: string
  message: string
  sender_type: "agent" | "admin"
  sender_name: string
  created_at: string
}

interface TicketData {
  _id: string
  subject: string
  description: string
  category: string
  priority: string
  status: string
  created_at: string
  updated_at: string
  admin_reply?: string
  replied_at?: string
  replies?: Reply[]
}

export default function AgentTicketDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [ticket, setTicket] = useState<TicketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [replyMessage, setReplyMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadTicket()
  }, [id])

  const loadTicket = async () => {
    try {
      const res = await fetch(`/api/agent/tickets/${id}`)
      const data = await res.json()
      setTicket(data)
    } catch (error) {
      console.error("[v0] Error loading ticket:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyMessage.trim()) return
    
    setSubmitting(true)
    try {
      const res = await fetch(`/api/agent/tickets/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyMessage }),
      })
      if (res.ok) {
        setReplyMessage("")
        loadTicket()
      }
    } catch (error) {
      console.error("[v0] Error submitting reply:", error)
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
        return <CheckCircle2 className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  // Combine old admin_reply with new replies array
  const getAllReplies = (): Reply[] => {
    const replies: Reply[] = []
    
    // Add old admin_reply for backward compatibility
    if (ticket?.admin_reply && ticket.replied_at) {
      replies.push({
        id: "legacy-admin-reply",
        message: ticket.admin_reply,
        sender_type: "admin",
        sender_name: "Admin",
        created_at: ticket.replied_at,
      })
    }
    
    // Add new format replies
    if (ticket?.replies) {
      replies.push(...ticket.replies)
    }
    
    // Sort by date
    return replies.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back Button */}
      <Link
        href="/agent/tickets"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tickets
      </Link>

      {loading ? (
        <div className="space-y-4">
          <div className="h-8 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-24 bg-muted animate-pulse rounded-lg" />
        </div>
      ) : !ticket ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">Ticket not found</p>
        </div>
      ) : (
        <>
          {/* Ticket Header */}
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-bold text-foreground mb-2">{ticket.subject}</h1>
              <p className="text-xs text-muted-foreground font-mono">
                Ticket ID: {ticket._id}
              </p>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Status</p>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}
                >
                  {getStatusIcon(ticket.status)}
                  {ticket.status.replace("_", " ")}
                </span>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Priority</p>
                <span
                  className={`inline-flex px-2 py-1 rounded text-xs font-medium capitalize ${getPriorityColor(ticket.priority)}`}
                >
                  {ticket.priority}
                </span>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <p className="text-sm font-medium text-foreground capitalize">
                  {ticket.category}
                </p>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Original Message */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">You</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(ticket.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Conversation Thread */}
          {getAllReplies().length > 0 && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-foreground">Conversation</h2>
              {getAllReplies().map((reply) => (
                <div
                  key={reply.id}
                  className={`bg-card border border-border rounded-lg overflow-hidden ${
                    reply.sender_type === "admin" ? "border-l-2 border-l-primary" : ""
                  }`}
                >
                  <div className="p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          reply.sender_type === "admin"
                            ? "bg-primary/10"
                            : "bg-muted"
                        }`}
                      >
                        {reply.sender_type === "admin" ? (
                          <Shield className="h-4 w-4 text-primary" />
                        ) : (
                          <User className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {reply.sender_name}
                          </p>
                          {reply.sender_type === "admin" && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                              ADMIN
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(reply.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {reply.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply Form */}
          {ticket.status !== "closed" && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">Add a Reply</h3>
              <form onSubmit={handleSubmitReply} className="space-y-3">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={submitting || !replyMessage.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    {submitting ? "Sending..." : "Send Reply"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {ticket.status === "closed" && (
            <div className="bg-muted/50 border border-border rounded-lg p-4 text-center">
              <CheckCircle2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                This ticket has been closed. If you need further assistance, please create a
                new ticket.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
