"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Phone, User, Loader2, CheckCircle, ArrowRight, Shield, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface EnquiryPopupProps {
  /** Whether the popup is visible */
  open: boolean
  /** Called when the user closes the popup */
  onClose: () => void
  /** Context to show the user — e.g. "Luxury Apartments in Gurgaon" */
  pageContext?: string
  /** Optional corridor / section name the user clicked from */
  corridorName?: string
  /** Pre-fill source_url (defaults to window.location.href) */
  sourceUrl?: string
}

interface FormState {
  name: string
  phone: string
}

type SubmitStatus = "idle" | "loading" | "success" | "error"

export function EnquiryPopup({
  open,
  onClose,
  pageContext = "Gurgaon Properties",
  corridorName,
  sourceUrl,
}: EnquiryPopupProps) {
  const [form, setForm] = useState<FormState>({ name: "", phone: "" })
  const [status, setStatus] = useState<SubmitStatus>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [focused, setFocused] = useState<keyof FormState | null>(null)

  // Reset form when popup re-opens
  useEffect(() => {
    if (open) {
      setForm({ name: "", phone: "" })
      setStatus("idle")
      setErrorMsg("")
    }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [open, onClose])

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  const handleChange = useCallback(
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    },
    []
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    // Basic phone validation — 10 digit Indian number starting with 6-9
    const cleanPhone = form.phone.replace(/\D/g, "")
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.")
      return
    }

    setStatus("loading")

    try {
      const res = await fetch("/api/property-enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: cleanPhone,
          property_name: corridorName
            ? `${pageContext} — ${corridorName}`
            : pageContext,
          enquiry_type: "property",
          source_url:
            sourceUrl ||
            (typeof window !== "undefined" ? window.location.href : ""),
          preferred_location: corridorName || pageContext,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus("success")
      } else {
        setStatus("error")
        setErrorMsg(data.error || "Something went wrong. Please try again.")
      }
    } catch {
      setStatus("error")
      setErrorMsg("Network error. Please check your connection.")
    }
  }

  if (!open) return null

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-popup-title"
    >
      {/* Dim overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Navy header strip */}
        <div className="bg-[var(--luxury-navy)] px-6 pt-6 pb-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close enquiry form"
          >
            <X className="h-4 w-4" />
          </button>

          <p className="text-[var(--luxury-gold)] text-xs font-bold uppercase tracking-widest mb-1">
            Free Expert Consultation
          </p>
          <h2
            id="enquiry-popup-title"
            className="text-white text-xl font-bold text-balance leading-snug"
          >
            {corridorName
              ? `Enquire About ${corridorName}`
              : `Get Details for ${pageContext}`}
          </h2>
          {corridorName && (
            <p className="text-white/70 text-xs mt-1">{pageContext}</p>
          )}
        </div>

        {/* Offset card */}
        <div className="-mt-4 mx-4 mb-4 bg-white rounded-xl border border-gray-100 shadow-lg p-5">
          {status === "success" ? (
            /* ── SUCCESS STATE ── */
            <div className="py-6 text-center">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-7 w-7 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-[var(--luxury-navy)] mb-1">
                Enquiry Received!
              </h3>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                Our property expert will call you within{" "}
                <span className="font-semibold text-[var(--luxury-navy)]">2 hours</span>{" "}
                with personalised project details.
              </p>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--luxury-navy)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--luxury-navy)]/90 transition-colors"
              >
                Done <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            /* ── FORM STATE ── */
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Error banner */}
              {status === "error" && errorMsg && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-100 text-xs text-red-700">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}

              {/* Name field */}
              <div>
                <label
                  htmlFor="eq-name"
                  className="text-xs font-semibold text-gray-700 block mb-1.5"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div
                  className={cn(
                    "relative rounded-lg transition-all",
                    focused === "name" && "ring-2 ring-[var(--luxury-navy)]/20"
                  )}
                >
                  <User
                    className={cn(
                      "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                      focused === "name"
                        ? "text-[var(--luxury-navy)]"
                        : "text-gray-400"
                    )}
                  />
                  <input
                    id="eq-name"
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    onFocus={() => setFocused("name")}
                    onBlur={() => setFocused(null)}
                    placeholder="Your full name"
                    required
                    autoComplete="name"
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-[var(--luxury-navy)] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Phone field */}
              <div>
                <label
                  htmlFor="eq-phone"
                  className="text-xs font-semibold text-gray-700 block mb-1.5"
                >
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div
                  className={cn(
                    "relative rounded-lg transition-all",
                    focused === "phone" && "ring-2 ring-[var(--luxury-navy)]/20"
                  )}
                >
                  {/* Country code badge */}
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500 select-none">
                    +91
                  </span>
                  <input
                    id="eq-phone"
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    onFocus={() => setFocused("phone")}
                    onBlur={() => setFocused(null)}
                    placeholder="10-digit number"
                    required
                    maxLength={10}
                    autoComplete="tel"
                    className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-[var(--luxury-navy)] focus:outline-none transition-colors"
                  />
                  <Phone
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors",
                      focused === "phone"
                        ? "text-[var(--luxury-navy)]"
                        : "text-gray-400"
                    )}
                  />
                </div>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-4 pt-1">
                <span className="flex items-center gap-1 text-[10px] text-gray-500">
                  <Shield className="h-3 w-3 text-emerald-500" />
                  100% Confidential
                </span>
                <span className="flex items-center gap-1 text-[10px] text-gray-500">
                  <Clock className="h-3 w-3 text-blue-500" />
                  Response in 2 hrs
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === "loading" || !form.name.trim() || !form.phone}
                className={cn(
                  "w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all",
                  status === "loading" || !form.name.trim() || !form.phone
                    ? "bg-[var(--luxury-navy)]/50 text-white cursor-not-allowed"
                    : "bg-[var(--luxury-navy)] text-white hover:bg-[var(--luxury-navy)]/90 shadow-lg shadow-[var(--luxury-navy)]/20 hover:shadow-xl"
                )}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Get Free Callback
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-gray-400">
                By submitting you agree to our{" "}
                <a href="/privacy-policy" className="underline hover:text-gray-600">
                  Privacy Policy
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
