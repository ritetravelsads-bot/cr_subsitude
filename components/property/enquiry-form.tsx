"use client"

import { useState } from "react"
import { Send, Phone, User, Mail, MessageSquare, Loader2, CheckCircle, Sparkles, Shield, Clock, HeadphonesIcon, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface EnquiryFormProps {
  propertyId?: string
  propertyName?: string
  propertySlug?: string
}

export function EnquiryForm({ propertyId, propertyName, propertySlug }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/property-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          property_id: propertyId,
          property_name: propertyName,
          property_slug: propertySlug,
          source_url: typeof window !== "undefined" ? window.location.href : null,
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setFormData({ name: "", phone: "", email: "", message: "" })
        toast.success("Enquiry submitted successfully!", {
          description: "Our expert team will contact you within 2 hours.",
        })
      } else {
        setError(data.error || "Failed to submit enquiry")
        toast.error("Failed to submit enquiry", {
          description: data.error || "Please try again or call us directly.",
        })
      }
    } catch (err) {
      setError("Network error. Please try again.")
      toast.error("Network error", {
        description: "Please check your connection and try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section className="py-10 md:py-14 bg-gradient-to-b from-primary/5 to-primary/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Thank You!</h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Your enquiry has been submitted successfully. Our expert team will contact you within 24 hours.
            </p>
            <Button onClick={() => setSuccess(false)} variant="outline" size="sm" className="rounded-lg text-xs">
              Submit Another Enquiry
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-10 md:py-14 bg-gradient-to-br from-primary/[0.03] via-background to-primary/[0.05] relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left Side - Info */}
          <div className="lg:col-span-2 lg:sticky lg:top-24">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-semibold mb-4 tracking-wide">
              <Sparkles className="h-3 w-3" />
              GET EXPERT ADVICE
            </div>

            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2 text-balance">
              Enquire About This Property
            </h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Our experts will help you make the right investment decision.
            </p>

            {/* Trust badges */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Quick Response</p>
                  <p className="text-[10px] text-muted-foreground">Reply within 2 hours</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <HeadphonesIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Expert Consultation</p>
                  <p className="text-[10px] text-muted-foreground">Free site visit assistance</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Verified Properties</p>
                  <p className="text-[10px] text-muted-foreground">100% genuine listings</p>
                </div>
              </div>
            </div>

            {/* Direct contact */}
            <div className="hidden lg:block p-4 bg-primary/5 border border-primary/10 rounded-xl">
              <p className="text-xs text-muted-foreground mb-2">Prefer to call?</p>
              <a href="tel:+919876543210" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
                <Phone className="h-4 w-4" />
                +91 98765 43210
              </a>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-4 shadow-xl shadow-black/5">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-xs text-destructive flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-destructive rounded-full" />
                  {error}
                </div>
              )}

              {/* Two column layout for name and phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Full Name <span className="text-destructive">*</span>
                  </label>
                  <div className={cn(
                    "relative rounded-lg transition-all duration-200",
                    focusedField === "name" && "ring-2 ring-primary/20"
                  )}>
                    <User className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                      focusedField === "name" ? "text-primary" : "text-muted-foreground"
                    )} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Your name"
                      required
                      className="w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    Phone Number <span className="text-destructive">*</span>
                  </label>
                  <div className={cn(
                    "relative rounded-lg transition-all duration-200",
                    focusedField === "phone" && "ring-2 ring-primary/20"
                  )}>
                    <Phone className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                      focusedField === "phone" ? "text-primary" : "text-muted-foreground"
                    )} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="10-digit number"
                      required
                      pattern="[6-9][0-9]{9}"
                      className="w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Email Address <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <div className={cn(
                  "relative rounded-lg transition-all duration-200",
                  focusedField === "email" && "ring-2 ring-primary/20"
                )}>
                  <Mail className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                    focusedField === "email" ? "text-primary" : "text-muted-foreground"
                  )} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">
                  Message <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <div className={cn(
                  "relative rounded-lg transition-all duration-200",
                  focusedField === "message" && "ring-2 ring-primary/20"
                )}>
                  <MessageSquare className={cn(
                    "absolute left-3 top-3 h-4 w-4 transition-colors",
                    focusedField === "message" ? "text-primary" : "text-muted-foreground"
                  )} />
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Tell us your requirements..."
                    rows={3}
                    className="w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full py-5 text-sm font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group" 
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Enquiry
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </Button>

              <p className="text-[10px] text-center text-muted-foreground">
                By submitting, you agree to our{" "}
                <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>
                {" "}and{" "}
                <a href="/terms-and-conditions" className="text-primary hover:underline">Terms of Service</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
