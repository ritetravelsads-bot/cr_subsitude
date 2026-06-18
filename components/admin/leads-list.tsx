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
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Phone, 
  Mail, 
  MessageSquare, 
  ExternalLink,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Filter,
  MoreHorizontal,
  StickyNote,
  Calendar,
  Building2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Lead, LeadStatus, LeadPriority } from "@/lib/models"

interface LeadWithId extends Lead {
  _id: string
}

interface Agent {
  _id: string
  username: string
  email: string
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
    unassigned: number
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

export default function AdminLeadsList() {
  const [leads, setLeads] = useState<LeadWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [stats, setStats] = useState<LeadsResponse["stats"] | null>(null)
  
  // Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [showUnassigned, setShowUnassigned] = useState(false)
  
  // Agents for assignment
  const [agents, setAgents] = useState<Agent[]>([])
  
  // Dialogs
  const [selectedLead, setSelectedLead] = useState<LeadWithId | null>(null)
  const [showAssignDialog, setShowAssignDialog] = useState(false)
  const [showNotesDialog, setShowNotesDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string>("")
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
      if (priorityFilter !== "all") params.set("priority", priorityFilter)
      if (showUnassigned) params.set("unassigned", "true")
      
      const response = await fetch(`/api/admin/leads?${params}`)
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
  }, [page, search, statusFilter, priorityFilter, showUnassigned])

  const fetchAgents = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const users = await response.json()
        setAgents(users.filter((u: Agent & { user_type: string }) => u.user_type === "agent"))
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error)
    }
  }, [])

  useEffect(() => {
    fetchLeads()
    fetchAgents()
  }, [fetchLeads, fetchAgents])

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (response.ok) {
        fetchLeads()
      }
    } catch (error) {
      console.error("Failed to update status:", error)
    }
  }

  const handlePriorityChange = async (leadId: string, newPriority: LeadPriority) => {
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: newPriority }),
      })
      
      if (response.ok) {
        fetchLeads()
      }
    } catch (error) {
      console.error("Failed to update priority:", error)
    }
  }

  const handleAssignLead = async () => {
    if (!selectedLead || !selectedAgent) return
    
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/leads/${selectedLead._id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent_id: selectedAgent }),
      })
      
      if (response.ok) {
        setShowAssignDialog(false)
        setSelectedLead(null)
        setSelectedAgent("")
        fetchLeads()
      }
    } catch (error) {
      console.error("Failed to assign lead:", error)
    } finally {
      setActionLoading(false)
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
        const leadResponse = await fetch(`/api/admin/leads/${selectedLead._id}`)
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

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return
    
    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        fetchLeads()
      }
    } catch (error) {
      console.error("Failed to delete lead:", error)
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <div className="bg-card border border-border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-foreground">{stats.total}</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <p className="text-xs text-blue-600">New</p>
            <p className="text-xl font-bold text-blue-700">{stats.new}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
            <p className="text-xs text-yellow-600">Contacted</p>
            <p className="text-xl font-bold text-yellow-700">{stats.contacted}</p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
            <p className="text-xs text-purple-600">Qualified</p>
            <p className="text-xl font-bold text-purple-700">{stats.qualified}</p>
          </div>
          <div className="bg-green-50 border border-green-100 rounded-lg p-3">
            <p className="text-xs text-green-600">Converted</p>
            <p className="text-xl font-bold text-green-700">{stats.converted}</p>
          </div>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
            <p className="text-xs text-gray-600">Lost</p>
            <p className="text-xl font-bold text-gray-700">{stats.lost}</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
            <p className="text-xs text-orange-600">Unassigned</p>
            <p className="text-xl font-bold text-orange-700">{stats.unassigned}</p>
          </div>
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
          
          <Select value={priorityFilter} onValueChange={(v) => { setPriorityFilter(v); setPage(1) }}>
            <SelectTrigger className="w-[130px] h-9 text-sm">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant={showUnassigned ? "default" : "outline"}
            size="sm"
            onClick={() => { setShowUnassigned(!showUnassigned); setPage(1) }}
            className="h-9"
          >
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            Unassigned
          </Button>
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
          <div className="p-8 text-center text-muted-foreground">No leads found</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-muted/30">
                  <TableHead className="text-xs font-medium">Contact</TableHead>
                  <TableHead className="text-xs font-medium">Property</TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                  <TableHead className="text-xs font-medium">Priority</TableHead>
                  <TableHead className="text-xs font-medium">Source</TableHead>
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
                          <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-primary">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </a>
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
                      <Select 
                        value={lead.priority} 
                        onValueChange={(v) => handlePriorityChange(lead._id, v as LeadPriority)}
                      >
                        <SelectTrigger className={`w-[90px] h-7 text-xs ${PRIORITY_COLORS[lead.priority]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">
                        {lead.source.replace("_", " ")}
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
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => {
                            setSelectedLead(lead)
                            setShowAssignDialog(true)
                          }}
                          title="Assign to Agent"
                        >
                          <UserPlus className="h-3.5 w-3.5" />
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedLead(lead)
                              setShowDetailDialog(true)
                            }}>
                              <ExternalLink className="h-3.5 w-3.5 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`tel:${lead.phone}`}>
                                <Phone className="h-3.5 w-3.5 mr-2" />
                                Call
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <a href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener">
                                <MessageSquare className="h-3.5 w-3.5 mr-2" />
                                WhatsApp
                              </a>
                            </DropdownMenuItem>
                            {lead.email && (
                              <DropdownMenuItem asChild>
                                <a href={`mailto:${lead.email}`}>
                                  <Mail className="h-3.5 w-3.5 mr-2" />
                                  Email
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDeleteLead(lead._id)}
                            >
                              Delete Lead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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

      {/* Assign Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Lead to Agent</DialogTitle>
            <DialogDescription>
              Select an agent to assign this lead to. They will be able to see and manage this lead.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {selectedLead && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm font-medium">{selectedLead.name}</p>
                <p className="text-xs text-muted-foreground">{selectedLead.phone}</p>
                {selectedLead.property_name && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Property: {selectedLead.property_name}
                  </p>
                )}
              </div>
            )}
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger>
                <SelectValue placeholder="Select an agent" />
              </SelectTrigger>
              <SelectContent>
                {agents.map((agent) => (
                  <SelectItem key={agent._id} value={agent._id}>
                    {agent.username || agent.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignLead} disabled={!selectedAgent || actionLoading}>
              {actionLoading ? "Assigning..." : "Assign Lead"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Lead Notes</DialogTitle>
            <DialogDescription>
              Add notes and track communication history for this lead.
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
                {selectedLead.assigned_to && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Assigned To</p>
                    <p className="text-sm">{selectedLead.assigned_to}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
