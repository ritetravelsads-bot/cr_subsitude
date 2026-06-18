"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { User, Mail, Phone, Save } from "lucide-react"

export default function AgentProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({ username: "", email: "", phone_number: "" })

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me", { cache: "no-store", credentials: "include" })
        const data = await res.json()
        setUser(data)
        setFormData({
          username: data.username,
          email: data.email,
          phone_number: data.phone_number || "",
        })
      } catch (error) {
        console.error("[v0] Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch("/api/agent/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        alert("Profile updated successfully")
      }
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded-lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agent Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your profile information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{user?.username}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mt-1 capitalize">
              {user?.user_type}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Username
            </label>
            <Input
              type="text"
              placeholder="Your username"
              value={formData.username}
              className="bg-muted/50"
              disabled
            />
            <p className="text-xs text-muted-foreground">Username cannot be changed</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              className="bg-muted/50"
              disabled
            />
            <p className="text-xs text-muted-foreground">Contact support to change email</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            />
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
