"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle2, Phone, Mail, User, MessageSquare } from "lucide-react"
import { toast } from "sonner"

interface ServiceEnquiryFormProps {
  serviceName: string
  serviceId: string
  compact?: boolean
}

export default function ServiceEnquiryForm({ serviceName, serviceId, compact = false }: ServiceEnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredContact: "phone",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          enquiry_type: "service",
          service_id: serviceId,
          service_name: serviceName,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({ name: "", email: "", phone: "", preferredContact: "phone", message: "" })
        toast.success("Enquiry submitted successfully!", {
          description: `Thank you for your interest in ${serviceName}. Our team will contact you within 24 hours.`,
        })
      } else {
        setError("Something went wrong. Please try again.")
        toast.error("Failed to submit enquiry", {
          description: "Please try again or contact us directly.",
        })
      }
    } catch {
      setError("Something went wrong. Please try again.")
      toast.error("Failed to submit enquiry", {
        description: "Please check your connection and try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-foreground">Thank You!</h3>
        <p className="text-muted-foreground">
          Your enquiry for {serviceName} has been submitted successfully. Our team will contact you within 24 hours.
        </p>
        <Button variant="outline" onClick={() => setSuccess(false)}>
          Submit Another Enquiry
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            Phone Number
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="preferredContact" className="text-sm font-medium">
            Preferred Contact Method
          </Label>
          <Select
            value={formData.preferredContact}
            onValueChange={(value) => setFormData({ ...formData, preferredContact: value })}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select contact method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="phone">Phone Call</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!compact && (
        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            Your Requirements (Optional)
          </Label>
          <Textarea
            id="message"
            placeholder={`Tell us more about your ${serviceName.toLowerCase()} requirements...`}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="resize-none"
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-2 rounded-lg">{error}</p>
      )}

      <Button type="submit" size="lg" className="w-full h-12 text-base font-semibold" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Get Free Consultation"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting, you agree to our privacy policy. We&apos;ll never share your information.
      </p>
    </form>
  )
}
