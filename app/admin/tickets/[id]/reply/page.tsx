"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/dashboard/page-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminTicketReplyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(false)
  const [ticket, setTicket] = useState<any>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState({
    reply_message: "",
    status: "in_progress",
  })

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const res = await fetch(`/api/admin/tickets/${id}`)
        const data = await res.json()
        setTicket(data)
        setFormData((prev) => ({ ...prev, status: data.status }))
      } catch (error) {
        console.error("[v0] Error loading ticket:", error)
      } finally {
        setInitialLoading(false)
      }
    }

    loadTicket()
  }, [id])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/tickets/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        router.push(`/admin/tickets/${id}`)
      }
    } catch (error) {
      console.error("[v0] Error replying to ticket:", error)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Reply to Ticket"
          showBackButton
          backHref={`/admin/tickets/${id}`}
        />
        <div className="space-y-4 max-w-2xl">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reply to Ticket"
        description={ticket?.subject ? `Subject: ${ticket.subject}` : undefined}
        showBackButton
        backHref={`/admin/tickets/${id}`}
      />

      <form onSubmit={handleSubmit} className="space-y-4 bg-card border border-border rounded-lg p-6 max-w-2xl">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1.5">Reply Message</label>
                  <textarea
                    name="reply_message"
                    value={formData.reply_message}
                    onChange={handleChange}
                    required
                    placeholder="Type your reply here..."
                    rows={6}
                    className="w-full px-3 py-2 text-sm border border-border rounded-md bg-input focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" disabled={loading} className="text-xs h-8">
            {loading ? "Sending..." : "Send Reply"}
          </Button>
          <Button type="button" variant="outline" className="text-xs h-8" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
