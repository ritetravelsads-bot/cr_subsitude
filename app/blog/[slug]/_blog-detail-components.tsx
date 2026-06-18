"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  Clock,
  Calendar,
  ChevronRight,
  Share2,
  Twitter,
  Facebook,
  Link as LinkIcon,
  ArrowLeft,
  Check,
  BookOpen,
  Tag,
  User
} from "lucide-react"

// ---------------------------------------------------------------
// Table of Contents
// ---------------------------------------------------------------
interface TocItem {
  id: string
  text: string
  level: number
}

function extractHeadings(html: string): TocItem[] {
  if (typeof window === "undefined") return []
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  const headings = Array.from(doc.querySelectorAll("h2, h3, h4"))
  return headings.map((h, idx) => {
    const level = parseInt(h.tagName.replace("H", ""))
    const text = h.textContent?.trim() || ""
    const id = h.id || `toc-heading-${idx}`
    return { id, text, level }
  })
}

export function TableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const items = extractHeadings(content)
    setHeadings(items)

    // Attach IDs to real DOM headings
    const articleEl = document.querySelector(".blog-article-content")
    if (articleEl) {
      const domHeadings = Array.from(articleEl.querySelectorAll("h2, h3, h4"))
      domHeadings.forEach((h, idx) => {
        if (!h.id) {
          h.id = `toc-heading-${idx}`
        }
      })
    }
  }, [content])

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: "-20% 0px -70% 0px" }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 2) return null

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">Table of Contents</span>
      </div>
      <nav className="space-y-1">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault()
              const el = document.getElementById(h.id)
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
              setActiveId(h.id)
            }}
            className={cn(
              "block text-sm py-1 rounded px-2 transition-colors leading-snug",
              h.level === 2 && "pl-2",
              h.level === 3 && "pl-5",
              h.level === 4 && "pl-8 text-xs",
              activeId === h.id
                ? "text-primary bg-primary/8 font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  )
}

// ---------------------------------------------------------------
// Share Buttons
// ---------------------------------------------------------------
export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">Share this article</span>
      </div>
      <div className="flex flex-col gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
        >
          <Twitter className="h-4 w-4 shrink-0" />
          Share on X (Twitter)
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
        >
          <Facebook className="h-4 w-4 shrink-0" />
          Share on Facebook
        </a>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-green-500 shrink-0" /> : <LinkIcon className="h-4 w-4 shrink-0" />}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------
// Reading Progress Bar
// ---------------------------------------------------------------
export function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement
      const scrollTop = window.scrollY
      const scrollHeight = el.scrollHeight - el.clientHeight
      const pct = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0
      setProgress(pct)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-border/30">
      <div
        className="h-full bg-primary transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// ---------------------------------------------------------------
// Back to Top button
// ---------------------------------------------------------------
export function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-6 z-50 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all"
      aria-label="Back to top"
    >
      <ArrowLeft className="h-4 w-4 rotate-90" />
    </button>
  )
}
