"use client"

import { useState } from "react"
import { HelpCircle, ChevronDown, Plus, Minus, MessageCircleQuestion } from "lucide-react"
import { cn } from "@/lib/utils"

interface FAQ {
  question: string
  answer: string
}

interface PropertyFaqProps {
  faqs: FAQ[]
}

export function PropertyFaq({ faqs }: PropertyFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!faqs || faqs.length === 0) return null

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <MessageCircleQuestion className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            <p className="text-muted-foreground text-sm mt-0.5">Get answers to common queries</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            
            return (
              <div
                key={index}
                className={cn(
                  "border-2 rounded-2xl overflow-hidden transition-all duration-300",
                  isOpen ? "border-primary/30 shadow-lg shadow-primary/5 bg-card" : "border-border bg-card hover:border-primary/20"
                )}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-start justify-between p-5 text-left group"
                >
                  <div className="flex items-start gap-4 pr-4">
                    <span className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors",
                      isOpen ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}>
                      {index + 1}
                    </span>
                    <span className={cn(
                      "text-[15px] font-semibold transition-colors pt-1",
                      isOpen ? "text-primary" : "text-foreground"
                    )}>
                      {faq.question}
                    </span>
                  </div>
                  <span className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                    isOpen ? "bg-primary text-white rotate-0" : "bg-muted text-muted-foreground"
                  )}>
                    {isOpen ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>

                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-out",
                    isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-5 pb-5 pl-[4.5rem]">
                    <div className="pt-2 border-t border-border">
                      <p className="text-[15px] text-muted-foreground leading-relaxed pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
