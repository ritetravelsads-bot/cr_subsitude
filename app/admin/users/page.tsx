"use client"
import { useEffect, useState, useCallback } from "react"
import { Trash2, RefreshCw, Phone, Mail, User, Calendar, Shield, Search, Filter, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface UserData {
  _id: string
  username: string
  email: string
  phone_number?: string
  user_type: string
  created_at?: string
  date_joined?: string
  is_verified?: boolean
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)

  const loadUsers = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setRefreshing(true)
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (Array.isArray(data)) {
        setUsers(data)
      } else {
        console.error("[v0] Unexpected data format:", data)
        setUsers([])
      }
    } catch (error) {
      console.error("[v0] Error loading users:", error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleRefresh = () => {
    loadUsers(true)
    toast.success("User list refreshed")
  }

  const handleDelete = async (userId: string, username: string) => {
    if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return
    }

    try {
      const res = await fetch(`/api/admin/users?id=${userId}`, {
        method: "DELETE"
      })

      if (res.ok) {
        setUsers(users.filter(u => u._id !== userId))
        toast.success(`User "${username}" deleted successfully`)
      } else {
        toast.error("Failed to delete user")
      }
    } catch (error) {
      console.error("[v0] Error deleting user:", error)
      toast.error("Failed to delete user")
    }
  }

  // Filter users based on search and type filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === "" || 
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone_number?.includes(searchQuery)
    
    const matchesType = filterType === "all" || user.user_type === filterType
    
    return matchesSearch && matchesType
  })

  // Get unique user types for filter
  const userTypes = [...new Set(users.map(u => u.user_type).filter(Boolean))]

  // Format phone number display
  const formatPhone = (phone?: string) => {
    if (!phone) return "-"
    // If it's a 10-digit number, format it nicely
    if (phone.length === 10 && /^\d+$/.test(phone)) {
      return `+91 ${phone.substring(0, 5)} ${phone.substring(5)}`
    }
    return phone
  }

  // Get user type badge color
  const getUserTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      admin: "bg-red-100 text-red-700 border-red-200",
      agent: "bg-blue-100 text-blue-700 border-blue-200",
      buyer: "bg-green-100 text-green-700 border-green-200",
      seller: "bg-amber-100 text-amber-700 border-amber-200",
      builder: "bg-purple-100 text-purple-700 border-purple-200",
    }
    return badges[type?.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <div className="px-4 py-8 md:py-12">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage all platform users ({filteredUsers.length} of {users.length} users)
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2 self-start sm:self-auto"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh List
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="bg-card border border-border rounded-lg p-4 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  filterType === "all" 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-background border-border hover:border-primary/50"
                }`}
              >
                All Users
              </button>
              {userTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border capitalize transition-colors ${
                    filterType === type 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "bg-background border-border hover:border-primary/50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="border border-border rounded-lg overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      Username
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5" />
                      Email
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      Mobile Number
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5" />
                      Type
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5" />
                      Joined
                    </div>
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <User className="h-8 w-8 text-muted-foreground/50" />
                        <span className="text-sm text-muted-foreground">
                          {searchQuery || filterType !== "all" 
                            ? "No users match your filters" 
                            : "No users found"}
                        </span>
                        {(searchQuery || filterType !== "all") && (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => { setSearchQuery(""); setFilterType("all"); }}
                            className="text-xs"
                          >
                            Clear filters
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                            {user.username?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.username || "-"}</p>
                            {user.is_verified && (
                              <span className="text-[10px] text-green-600 font-medium">Verified</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <a 
                          href={`mailto:${user.email}`} 
                          className="text-foreground hover:text-primary transition-colors"
                        >
                          {user.email || "-"}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        {user.phone_number ? (
                          <a 
                            href={`tel:${user.phone_number}`} 
                            className="flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5 text-primary" />
                            {formatPhone(user.phone_number)}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full border capitalize ${getUserTypeBadge(user.user_type)}`}>
                          {user.user_type || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {user.created_at || user.date_joined 
                          ? new Date(user.created_at || user.date_joined!).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-destructive/10"
                          onClick={() => handleDelete(user._id, user.username)}
                          disabled={user.user_type === "admin"}
                          title={user.user_type === "admin" ? "Cannot delete admin users" : "Delete user"}
                        >
                          <Trash2 className={`h-4 w-4 ${user.user_type === "admin" ? "text-muted-foreground" : "text-destructive"}`} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Summary */}
        {!loading && users.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-2xl font-bold text-foreground">
                {users.filter(u => u.user_type === "buyer").length}
              </p>
              <p className="text-xs text-muted-foreground">Buyers</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-2xl font-bold text-foreground">
                {users.filter(u => u.user_type === "agent").length}
              </p>
              <p className="text-xs text-muted-foreground">Agents</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-2xl font-bold text-foreground">
                {users.filter(u => u.phone_number).length}
              </p>
              <p className="text-xs text-muted-foreground">With Phone</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
