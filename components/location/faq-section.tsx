'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FAQ } from '@/data/location-content'

interface FAQSectionProps {
  faqs: FAQ[]
  locationName: string
}

export default function FAQSection({ faqs, locationName }: FAQSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[var(--luxury-gold)] text-sm uppercase tracking-widest font-medium">
            Have Questions?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--luxury-navy)] mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[var(--luxury-dark)]/70 max-w-2xl mx-auto">
            Everything you need to know about investing in {locationName}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-[var(--luxury-dark)]/70 mb-4">
            Still have questions? Our experts are here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[var(--luxury-navy)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--luxury-gold)] hover:text-[var(--luxury-navy)] transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
            Contact Our Team
          </a>
        </div>
      </div>
    </section>
  )
}

function FAQItem({ faq }: { faq: FAQ }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-[var(--luxury-border)] rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--luxury-cream)] transition-colors"
      >
        <h3 className="text-lg font-semibold text-[var(--luxury-navy)] pr-4">
          {faq.question}
        </h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-[var(--luxury-gold)] flex-shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isOpen ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <div className="p-6 pt-0 text-[var(--luxury-dark)]/70 leading-relaxed">
          {faq.answer}
        </div>
      </div>
    </div>
  )
}
