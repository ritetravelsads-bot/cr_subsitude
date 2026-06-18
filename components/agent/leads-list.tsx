"use client"

import { useEffect, useState, useCallback } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search, 
  Phone, 
  Mail, 
  MessageSquare, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  StickyNote,
  Calendar,
  Building2,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react"
import type { Lead, LeadStatus, LeadPriority } from "@/lib/models"

interface LeadWithId extends Lead {
  _id: string
}

interface LeadsResponse {
  leads: LeadWithId[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  stats: {
    total: number
    new: number
    contacted: number
    qualified: number
    converted: number
    lost: number
    assigned_to_me: number
    from_my_properties: number
  }
}

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-700 border-blue-200",
  contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
  qualified: "bg-purple-100 text-purple-700 border-purple-200",
  converted: "bg-green-100 text-green-700 border-green-200",
  lost: "bg-gray-100 text-gray-500 border-gray-200",
}

const PRIORITY_COLORS: Record<LeadPriority, string> = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-blue-100 text-blue-600",
  high: "bg-orange-100 text-orange-600",
  urgent: "bg-red-100 text-red-600",
}

export default function AgentLeadsList() {
  const [leads, setLeads] = useState<LeadWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [stats, setStats] = useState<LeadsResponse["stats"] | null>(null)
  
  // Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  
  // Dialogs
  const [selectedLead, setSelectedLead] = useState<LeadWithId | null>(null)
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [newNote, setNewNote] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
      })
      
      if (search) params.set("search", search)
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (filterType !== "all") params.set("filter_type", filterType)
      
      const response = await fetch(`/api/agent/leads?${params}`)
      if (response.ok) {
        const data: LeadsResponse = await response.json()
        setLeads(data.leads)
        setPagination({ total: data.pagination.total, pages: data.pagination.pages })
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error)
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter, filterType])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const response = await fetch(`/api/agent/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: newStatus,
          last_contacted_at: newStatus === "contacted" ? new Date().toISOString() : undefined,
        }),
      })
      
      if (response.ok) {
        fetchLeads()
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const handleAddNote = async () => {
    if (!selectedLead || !newNote.trim()) return
    
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/leads/${selectedLead._id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newNote }),
      })
      
      if (response.ok) {
        setNewNote("")
        // Refresh lead details
        const leadResponse = await fetch(`/api/agent/leads/${selectedLead._id}`)
        if (leadResponse.ok) {
          const updatedLead = await leadResponse.json()
          setSelectedLead(updatedLead)
        }
      }
    } catch (error) {
      console.error("Failed to add note:", error)
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">New Leads</p>
                  <p className="text-2xl font-bold">{stats.new}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{stats.contacted + stats.qualified}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Converted</p>
                  <p className="text-2xl font-bold">{stats.converted}</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Stats */}
      {stats && (
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">
            Assigned to me: <strong className="text-foreground">{stats.assigned_to_me}</strong>
          </span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">
            From my properties: <strong className="text-foreground">{stats.from_my_properties}</strong>
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              className="pl-9 w-[200px] h-9 text-sm"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="w-[130px] h-9 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1) }}>
            <SelectTrigger className="w-[150px] h-9 text-sm">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Leads</SelectItem>
              <SelectItem value="assigned">Assigned to Me</SelectItem>
              <SelectItem value="my_properties">My Properties</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button variant="outline" size="sm" onClick={() => fetchLeads()} className="h-9">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Refresh
        </Button>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No leads found</p>
            <p className="text-xs mt-1">New leads will appear here when enquiries are submitted</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/30">
                  <TableHead className="text-xs font-medium">Contact</TableHead>
                  <TableHead className="text-xs font-medium">Property</TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                  <TableHead className="text-xs font-medium">Priority</TableHead>
                  <TableHead className="text-xs font-medium">Date</TableHead>
                  <TableHead className="text-xs font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead._id} className="border-border">
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{lead.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.property_name ? (
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <a 
                            href={`/property/${lead.property_slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline max-w-[150px] truncate block"
                          >
                            {lead.property_name}
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">General Enquiry</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={lead.status} 
                        onValueChange={(v) => handleStatusChange(lead._id, v as LeadStatus)}
                      >
                        <SelectTrigger className={`w-[100px] h-7 text-xs border ${STATUS_COLORS[lead.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${PRIORITY_COLORS[lead.priority]}`}>
                        {lead.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        <p>{formatDate(lead.created_at)}</p>
                        <p className="text-[10px]">{formatTime(lead.created_at)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          asChild
                        >
                          <a href={`tel:${lead.phone}`}>
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          asChild
                        >
                          <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            WhatsApp
                          </a>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setSelectedLead(lead)
                            setShowNotesDialog(true)
                          }}
                          title="Add Note"
                        >
                          <StickyNote className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setSelectedLead(lead)
                            setShowDetailDialog(true)
                          }}
                          title="View Details"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {leads.length} of {pagination.total} leads
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {pagination.pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead Notes</DialogTitle>
            <DialogDescription>
              Add notes and track your communication history.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {selectedLead?.notes && selectedLead.notes.length > 0 ? (
              <div className="space-y-3">
                {selectedLead.notes.map((note, i) => (
                  <div key={i} className="bg-muted/50 rounded-lg p-3">
                    <p className="text-sm">{note.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <span>{note.created_by_name || note.created_by_type}</span>
                      <span>•</span>
                      <span>{formatDate(note.created_at)} at {formatTime(note.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No notes yet</p>
            )}
            <div className="space-y-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={handleAddNote} 
                disabled={!newNote.trim() || actionLoading}
                className="w-full"
              >
                {actionLoading ? "Adding..." : "Add Note"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Name</p>
                  <p className="text-sm font-medium">{selectedLead.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Phone</p>
                  <p className="text-sm font-medium">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-medium">{selectedLead.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Source</p>
                  <Badge variant="outline" className="capitalize">
                    {selectedLead.source.replace("_", " ")}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge className={STATUS_COLORS[selectedLead.status]}>
                    {selectedLead.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Priority</p>
                  <Badge className={PRIORITY_COLORS[selectedLead.priority]}>
                    {selectedLead.priority}
                  </Badge>
                </div>
              </div>
              
              {selectedLead.property_name && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Property</p>
                  <a 
                    href={`/property/${selectedLead.property_slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Building2 className="h-4 w-4" />
                    {selectedLead.property_name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              
              {selectedLead.message && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Message</p>
                  <p className="text-sm bg-muted/50 rounded-lg p-3">{selectedLead.message}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Created</p>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(selectedLead.created_at)} at {formatTime(selectedLead.created_at)}
                  </p>
                </div>
                {selectedLead.last_contacted_at && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Contacted</p>
                    <p className="text-sm">
                      {formatDate(selectedLead.last_contacted_at)}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${selectedLead.phone}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://wa.me/${selectedLead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
                {selectedLead.email && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${selectedLead.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
