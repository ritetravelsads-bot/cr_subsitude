"use client"

import { FileText } from "lucide-react"

interface SpecialSectionProps {
  section: {
    id: string
    title: string
    subtitle?: string
    content: string
    position: string
  }
}

export function SpecialSection({ section }: SpecialSectionProps) {
  if (!section.title || !section.content) return null

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm shadow-primary/20">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-foreground">{section.title}</h2>
          </div>
        </div>
        <div className="max-w-none">
          {section.subtitle && (
            <h3 className="text-base md:text-lg font-semibold text-foreground/90 mb-3">
              {section.subtitle}
            </h3>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {section.content}
          </p>
        </div>
      </div>
    </section>
  )
}

interface SpecialSectionsRendererProps {
  sections: Array<{
    id: string
    title: string
    subtitle?: string
    content: string
    position: string
  }>
  position: string
}

export function SpecialSectionsRenderer({ sections, position }: SpecialSectionsRendererProps) {
  const filteredSections = sections?.filter(s => s.position === position) || []
  
  if (filteredSections.length === 0) return null

  return (
    <>
      {filteredSections.map((section) => (
        <SpecialSection key={section.id} section={section} />
      ))}
    </>
  )
}
