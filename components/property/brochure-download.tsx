"use client"

import { Download, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BrochureDownloadProps {
  brochureUrl?: string
  propertyName?: string
}

export function BrochureDownload({ brochureUrl, propertyName }: BrochureDownloadProps) {
  if (!brochureUrl) return null

  return (
    <section className="py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-foreground">
                  Download Brochure
                </h2>
                <p className="text-sm text-muted-foreground">
                  Get detailed information about {propertyName || "this project"}
                </p>
              </div>
            </div>

            <Button asChild size="lg" className="md:px-8">
              <a href={brochureUrl} target="_blank" rel="noopener noreferrer" download>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
