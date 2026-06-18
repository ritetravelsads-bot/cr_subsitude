"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    id: 1,
    question: "What type of properties does CountryRoof specialise in?",
    answer:
      "CountryRoof specialises exclusively in luxury ready-to-move and new launch properties across Gurgaon's prime corridors — Dwarka Expressway, Golf Course Road, Golf Course Extension Road, and Southern Peripheral Road (SPR). We deal in 3 BHK and 4 BHK premium apartments and flats from Gurgaon's most trusted RERA-approved developers.",
  },
  {
    id: 2,
    question: "Does CountryRoof only deal in ready-to-move properties?",
    answer:
      "We specialise in ready-to-move luxury properties for buyers who want immediate possession without construction risk. We also offer carefully selected new launch projects from trusted developers where early investment delivers strong long-term appreciation.",
  },
  {
    id: 3,
    question: "Which developers does CountryRoof work with?",
    answer:
      "We partner exclusively with RERA-approved, trusted developers with a proven delivery track record in Gurgaon — including Sobha, TARC, Silverglades, and DLF. Every project listed on CountryRoof is vetted for legal clearance, construction quality, and investment potential.",
  },
  {
    id: 4,
    question: "Does CountryRoof offer homes for senior citizens?",
    answer:
      "Yes. We have a dedicated advisory for senior citizen-friendly homes in Gurgaon — properties with ground floor access, lift facilities, medical amenities nearby, and gated security. We help senior buyers and their families find the right fit without any pressure.",
  },
  {
    id: 5,
    question: "How does CountryRoof help me choose the right property?",
    answer:
      "We do not just show listings — we advise. Our team understands your budget, lifestyle, and investment goals and recommends only those properties that genuinely match your needs. We believe in trust-based advisory, not commission-driven selling.",
  },
  {
    id: 6,
    question: "Are all properties on CountryRoof RERA verified?",
    answer:
      "Yes — 100%. Every property listed on CountryRoof is RERA approved and legally verified. We do not list any project that lacks proper regulatory clearance, ensuring complete peace of mind for every buyer.",
  },
]

export default function FAQs() {
  const [openId, setOpenId] = useState<number | null>(1)

  const toggle = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#002366]/8 text-[#002366] text-xs font-bold tracking-widest uppercase mb-6 rounded-sm">
            <HelpCircle className="w-3.5 h-3.5" />
            FAQs
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#002366] tracking-tight text-balance mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to know before buying your next home in Gurgaon.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="flex flex-col divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id
            return (
              <div key={faq.id} className="bg-white">
                <button
                  onClick={() => toggle(faq.id)}
                  className={cn(
                    "w-full flex items-start justify-between gap-4 px-6 py-5 text-left transition-colors duration-150",
                    isOpen ? "bg-[#002366]/4" : "hover:bg-slate-50"
                  )}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span
                      className={cn(
                        "shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5",
                        isOpen
                          ? "bg-[#002366] text-white"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {index + 1}
                    </span>
                    <span
                      className={cn(
                        "font-semibold text-base leading-snug",
                        isOpen ? "text-[#002366]" : "text-foreground"
                      )}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-[#002366] transition-transform duration-300 mt-0.5",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                <div
                  id={`faq-answer-${faq.id}`}
                  role="region"
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <p className="px-6 pb-5 pt-1 pl-[3.75rem] text-muted-foreground leading-relaxed text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <p className="text-center text-muted-foreground mt-8 text-sm">
          Still have questions?{" "}
          <a
            href="/contact"
            className="text-[#002366] font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity"
          >
            Talk to a property specialist
          </a>
        </p>
      </div>
    </section>
  )
}
