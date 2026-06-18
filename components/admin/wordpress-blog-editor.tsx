"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { EditorCanvas } from "@/components/blog/block-editor"
import type { Editor } from "@tiptap/core"
import {
  Save,
  Eye,
  Send,
  Settings2,
  Search,
  ChevronRight,
  ChevronDown,
  Calendar,
  User,
  Tag,
  Image as ImageIcon,
  FileText,
  Globe,
  Clock,
  X,
  Plus,
  Check,
  Loader2,
  PanelRightClose,
  PanelRight,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  ListTree,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  Minimize2,
  RectangleHorizontal,
  Palette,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  HelpCircle,
  Braces,
  Trash2,
  GripVertical,
  Copy,
  CheckCheck
} from "lucide-react"

interface BlogCategory {
  _id: string
  name: string
  slug: string
}

interface FAQItem {
  id: string
  question: string
  answer: string
}

interface WordPressBlogEditorProps {
  initialData?: {
    _id?: string
    title?: string
    content?: string
    category?: string | string[]
    author?: string
    readTime?: string
    cover_image?: string
    banner_image?: string
    meta_title?: string
    meta_description?: string
    meta_keywords?: string
    og_title?: string
    og_description?: string
    og_image?: string
    tags?: string[] | string
    is_published?: boolean
    slug?: string
    faqs?: FAQItem[]
    canonical_url?: string
  }
}

// Collapsible Panel Component
function CollapsiblePanel({
  title,
  icon: Icon,
  children,
  defaultOpen = false
}: {
  title: string
  icon: React.ElementType
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">{title}</span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  )
}

// SEO Score Component
function SEOScore({ score, label }: { score: number; label: string }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return "bg-green-500"
    if (s >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getScoreColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-medium text-muted-foreground w-12">{label}</span>
    </div>
  )
}

// Google Preview Component
function GooglePreview({
  title,
  slug,
  description,
  siteUrl = "countryroof.in"
}: {
  title: string
  slug: string
  description: string
  siteUrl?: string
}) {
  const displayUrl = `${siteUrl}/blogs/${slug || "post-url"}`
  const displayTitle = title || "Post title"
  const displayDesc = description || "Add a meta description to see how this post will appear in search results..."

  return (
    <div className="p-3 bg-background rounded-lg border border-border">
      <p className="text-xs text-muted-foreground mb-1">Google Preview</p>
      <div className="space-y-1">
        <p className="text-xs text-green-700 dark:text-green-400 truncate">{displayUrl}</p>
        <p className="text-base text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-1">
          {displayTitle}
        </p>
        <p className="text-xs text-muted-foreground line-clamp-2">{displayDesc}</p>
      </div>
    </div>
  )
}

// Extract plain-text excerpt from HTML content (first paragraph, max 200 chars)
function extractExcerptFromContent(htmlContent: string, maxLength = 200): string {
  if (!htmlContent) return ""
  let plain = htmlContent
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<\/(p|div|h[1-6]|li|br|hr)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
  const first = plain.split(/\n+/).filter(p => p.trim().length > 0)[0] || plain
  if (first.length <= maxLength) return first
  const cut = first.substring(0, maxLength)
  const lastSpace = cut.lastIndexOf(" ")
  return (lastSpace > 0 ? cut.substring(0, lastSpace) : cut) + "..."
}

// Schema Markup Generator
function generateBlogSchema({
  title,
  content,
  author,
  slug,
  cover_image,
  categories,
  tags,
  faqs,
  datePublished,
  dateModified,
  siteUrl = "https://countryroof.in"
}: {
  title: string
  content: string
  author: string
  slug: string
  cover_image: string
  categories: string[]
  tags: string[]
  faqs: FAQItem[]
  datePublished?: string
  dateModified?: string
  siteUrl?: string
}) {
  // Get plain text word count
  const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null
  let plainText = content
  if (tempDiv) {
    tempDiv.innerHTML = content
    plainText = tempDiv.textContent || tempDiv.innerText || ''
  } else {
    plainText = content.replace(/<[^>]*>/g, ' ')
  }
  const wordCount = plainText.trim().split(/\s+/).filter(w => w.length > 0).length

  const schemas: object[] = []

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": extractExcerptFromContent(content, 200) || plainText.substring(0, 160),
    "author": {
      "@type": "Person",
      "name": author || "Country Roof"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Country Roof",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/blogs/${slug}`
    },
    "url": `${siteUrl}/blogs/${slug}`,
    "datePublished": datePublished || new Date().toISOString(),
    "dateModified": dateModified || new Date().toISOString(),
    "wordCount": wordCount,
    ...(cover_image && {
      "image": {
        "@type": "ImageObject",
        "url": cover_image
      }
    }),
    "articleSection": categories.length > 0 ? categories[0] : "Uncategorized",
    ...(tags.length > 0 && {
      "keywords": tags.join(", ")
    })
  }
  schemas.push(articleSchema)

  // FAQ Schema (if FAQs exist)
  const validFaqs = faqs.filter(faq => faq.question?.trim() && faq.answer?.trim())
  if (validFaqs.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": validFaqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
    schemas.push(faqSchema)
  }

  // BreadcrumbList Schema - includes category (or Uncategorized) and blog title
  const categoryName = categories.length > 0 ? categories[0] : "Uncategorized"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteUrl
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${siteUrl}/blogs`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryName,
        "item": `${siteUrl}/blogs`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": title,
        "item": `${siteUrl}/blogs/${slug}`
      }
    ]
  }
  schemas.push(breadcrumbSchema)

  return schemas
}

// Schema Preview Modal Component
function SchemaPreviewModal({
  isOpen,
  onClose,
  schemas
}: {
  isOpen: boolean
  onClose: () => void
  schemas: object[]
}) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const schemaString = JSON.stringify(schemas, null, 2)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(schemaString)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-3xl max-h-[80vh] flex flex-col m-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Braces className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Schema Markup Preview</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2"
            >
              {copied ? (
                <>
                  <CheckCheck className="h-4 w-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            {schemas.map((schema, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">
                    {(schema as { "@type"?: string })["@type"] || "Schema"} Schema
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full">
                    Valid JSON-LD
                  </span>
                </div>
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto font-mono">
                  <code>{JSON.stringify(schema, null, 2)}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">
            This schema markup will be automatically embedded in your blog post when published.
            It helps search engines understand your content better and can improve rich snippets in search results.
          </p>
        </div>
      </div>
    </div>
  )
}

// FAQ Section Component
function FAQSection({
  faqs,
  onAddFaq,
  onUpdateFaq,
  onRemoveFaq
}: {
  faqs: FAQItem[]
  onAddFaq: () => void
  onUpdateFaq: (id: string, field: "question" | "answer", value: string) => void
  onRemoveFaq: (id: string) => void
}) {
  return (
    <div className="border border-border rounded-lg bg-card">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Frequently Asked Questions</h3>
          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
            {faqs.length} {faqs.length === 1 ? "FAQ" : "FAQs"}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddFaq}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {faqs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium mb-1">No FAQs added yet</p>
            <p className="text-xs">Add frequently asked questions to improve SEO with FAQ schema markup.</p>
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="group border border-border rounded-lg bg-background hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-3 p-4">
                <div className="flex items-center gap-2 text-muted-foreground pt-2">
                  <GripVertical className="h-4 w-4 opacity-50 cursor-grab" />
                  <span className="text-sm font-medium text-primary w-6">{index + 1}.</span>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Question
                    </label>
                    <Input
                      value={faq.question}
                      onChange={(e) => onUpdateFaq(faq.id, "question", e.target.value)}
                      placeholder="Enter the question..."
                      className="font-medium"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      Answer
                    </label>
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => onUpdateFaq(faq.id, "answer", e.target.value)}
                      placeholder="Enter the answer..."
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFaq(faq.id)}
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {faqs.length > 0 && (
        <div className="px-4 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <Braces className="h-3 w-3" />
            FAQ Schema markup will be automatically generated for search engines.
          </p>
        </div>
      )}
    </div>
  )
}

// Block Settings Panel Component
function BlockSettingsPanel({
  blockType,
  blockPos,
  onClose,
  editor
}: {
  blockType: string | null
  blockPos: number | null
  onClose: () => void
  editor: Editor | null
}) {
  const [imageWidth, setImageWidth] = useState("")
  const [imageHeight, setImageHeight] = useState("")
  const [altText, setAltText] = useState("")

  if (!blockType) return null

  const getBlockIcon = () => {
    switch (blockType) {
      case "heading": return Heading1
      case "paragraph": return Type
      case "bulletList": return List
      case "orderedList": return ListOrdered
      case "blockquote": return Quote
      case "codeBlock": return Code
      case "image": return ImageIcon
      case "horizontalRule": return Minus
      default: return Layers
    }
  }

  const BlockIcon = getBlockIcon()
  const blockLabel = blockType.charAt(0).toUpperCase() + blockType.slice(1).replace(/([A-Z])/g, " $1")

  // Image size handlers - use the tracked blockPos for the selected image
  const handleImagePercentSize = (percent: string) => {
    if (!editor) return

    // Use the tracked blockPos if available, otherwise try to find from current selection
    let imagePos = blockPos

    if (imagePos === null) {
      // Fallback: check if current selection is on an image
      const { selection } = editor.state
      const node = editor.state.doc.nodeAt(selection.from)
      if (node?.type.name === "image") {
        imagePos = selection.from
      }
    }

    if (imagePos !== null) {
      editor.chain()
        .setNodeSelection(imagePos)
        .updateAttributes("image", {
          style: percent === "auto" ? "" : `width: ${percent}; max-width: 100%;`
        })
        .run()
    }
  }

  const handleImagePixelSize = (px: number) => {
    if (!editor) return

    // Use the tracked blockPos if available
    let imagePos = blockPos

    if (imagePos === null) {
      const { selection } = editor.state
      const node = editor.state.doc.nodeAt(selection.from)
      if (node?.type.name === "image") {
        imagePos = selection.from
      }
    }

    if (imagePos !== null) {
      editor.chain()
        .setNodeSelection(imagePos)
        .updateAttributes("image", {
          style: `width: ${px}px; max-width: 100%;`
        })
        .run()
    }
    setImageWidth(px.toString())
  }

  const handleCustomSize = () => {
    if (!editor) return
    const w = parseInt(imageWidth)
    const h = parseInt(imageHeight)
    if (w > 0) {
      const style = h > 0
        ? `width: ${w}px; height: ${h}px; max-width: 100%;`
        : `width: ${w}px; max-width: 100%;`

      // Use the tracked blockPos if available
      let imagePos = blockPos

      if (imagePos === null) {
        const { selection } = editor.state
        const node = editor.state.doc.nodeAt(selection.from)
        if (node?.type.name === "image") {
          imagePos = selection.from
        }
      }

      if (imagePos !== null) {
        editor.chain()
          .setNodeSelection(imagePos)
          .updateAttributes("image", { style })
          .run()
      }
    }
  }

  const handleAltTextChange = (value: string) => {
    setAltText(value)
    if (!editor) return

    // Use the tracked blockPos if available
    let imagePos = blockPos

    if (imagePos === null) {
      const { selection } = editor.state
      const node = editor.state.doc.nodeAt(selection.from)
      if (node?.type.name === "image") {
        imagePos = selection.from
      }
    }

    if (imagePos !== null) {
      editor.chain()
        .setNodeSelection(imagePos)
        .updateAttributes("image", { alt: value })
        .run()
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BlockIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">{blockLabel}</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 hover:bg-muted rounded"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Typography Settings - for text blocks */}
      {["paragraph", "heading", "text"].includes(blockType) && (
        <CollapsiblePanel title="Typography" icon={Type} defaultOpen>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Text Alignment</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                  className={cn("flex-1 p-2 border border-border rounded hover:bg-muted", editor?.isActive({ textAlign: "left" }) && "bg-muted")}
                >
                  <AlignLeft className="h-4 w-4 mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                  className={cn("flex-1 p-2 border border-border rounded hover:bg-muted", editor?.isActive({ textAlign: "center" }) && "bg-muted")}
                >
                  <AlignCenter className="h-4 w-4 mx-auto" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                  className={cn("flex-1 p-2 border border-border rounded hover:bg-muted", editor?.isActive({ textAlign: "right" }) && "bg-muted")}
                >
                  <AlignRight className="h-4 w-4 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </CollapsiblePanel>
      )}

      {/* Image Settings */}
      {blockType === "image" && (
        <>
          <CollapsiblePanel title="Image Size" icon={Maximize2} defaultOpen>
            <div className="space-y-3">
              {/* Percentage presets */}
              <div>
                <label className="text-xs font-medium mb-1 block">Width (%)</label>
                <div className="flex flex-wrap gap-1">
                  {["25%", "50%", "75%", "100%", "auto"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleImagePercentSize(size)}
                      className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded border border-border"
                    >
                      {size === "auto" ? "Auto" : size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pixel presets */}
              <div>
                <label className="text-xs font-medium mb-1 block">Width (px)</label>
                <div className="flex flex-wrap gap-1">
                  {[150, 300, 450, 600, 800, 1024].map((px) => (
                    <button
                      key={px}
                      type="button"
                      onClick={() => handleImagePixelSize(px)}
                      className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded border border-border"
                    >
                      {px}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom size */}
              <div>
                <label className="text-xs font-medium mb-1 block">Custom (px)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Width"
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value)}
                    className="flex-1 h-8 text-sm border border-border rounded px-2 bg-background"
                  />
                  <input
                    type="number"
                    placeholder="Height"
                    value={imageHeight}
                    onChange={(e) => setImageHeight(e.target.value)}
                    className="flex-1 h-8 text-sm border border-border rounded px-2 bg-background"
                  />
                  <button
                    type="button"
                    onClick={handleCustomSize}
                    disabled={!imageWidth}
                    className="px-3 h-8 text-xs bg-primary text-primary-foreground rounded disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </CollapsiblePanel>

          <CollapsiblePanel title="Alt Text" icon={FileText} defaultOpen>
            <div className="space-y-2">
              <Input
                placeholder="Describe the image..."
                className="h-8 text-sm"
                value={altText}
                onChange={(e) => handleAltTextChange(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">Important for accessibility and SEO</p>
            </div>
          </CollapsiblePanel>
        </>
      )}

      {/* Color Settings - for applicable blocks */}
      {["paragraph", "heading", "blockquote"].includes(blockType) && (
        <CollapsiblePanel title="Color" icon={Palette}>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Text Color</label>
              <div className="flex gap-1 flex-wrap">
                {["#000000", "#374151", "#DC2626", "#2563EB", "#059669", "#D97706", "#7C3AED"].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => editor?.chain().focus().setColor(color).run()}
                    className={cn(
                      "w-6 h-6 rounded border-2 transition-all hover:scale-110",
                      editor?.getAttributes("textStyle").color === color
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border"
                    )}
                    style={{ backgroundColor: color }}
                    title={`Set text color to ${color}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().unsetColor().run()}
                  className="w-6 h-6 rounded border-2 border-border flex items-center justify-center text-xs hover:bg-muted"
                  title="Remove text color"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Background Color</label>
              <div className="flex gap-1 flex-wrap">
                {["transparent", "#F3F4F6", "#FEE2E2", "#DBEAFE", "#D1FAE5", "#FEF3C7", "#EDE9FE"].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      if (color === "transparent") {
                        editor?.chain().focus().unsetHighlight().run()
                      } else {
                        editor?.chain().focus().setHighlight({ color }).run()
                      }
                    }}
                    className={cn(
                      "w-6 h-6 rounded border-2 transition-all hover:scale-110",
                      (color === "transparent" && !editor?.getAttributes("highlight").color) ||
                        editor?.getAttributes("highlight").color === color
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border"
                    )}
                    style={{ backgroundColor: color === "transparent" ? "white" : color }}
                    title={color === "transparent" ? "Remove background color" : `Set background to ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </CollapsiblePanel>
      )}

      {/* Spacing Settings */}
      <CollapsiblePanel title="Spacing" icon={RectangleHorizontal}>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium mb-1 block">Margin Top</label>
            <Input type="number" placeholder="0" className="h-8 text-sm" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Margin Bottom</label>
            <Input type="number" placeholder="0" className="h-8 text-sm" />
          </div>
        </div>
      </CollapsiblePanel>
    </div>
  )
}

export default function WordPressBlogEditor({ initialData }: WordPressBlogEditorProps) {
  const router = useRouter()
  const isEditing = !!initialData?._id
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePanel, setActivePanel] = useState<"post" | "seo" | "block" | "toc">("post")
  const [selectedBlockType, setSelectedBlockType] = useState<string | null>(null)
  const [selectedBlockPos, setSelectedBlockPos] = useState<number | null>(null)
  const [editorInstance, setEditorInstance] = useState<any>(null)
  const autoSaveRef = useRef<NodeJS.Timeout | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaving, setAutoSaving] = useState(false)
  const [showSchemaPreview, setShowSchemaPreview] = useState(false)

  // Parse initial categories
  const getInitialCategories = () => {
    if (!initialData?.category) return []
    if (Array.isArray(initialData.category)) return initialData.category
    return [initialData.category]
  }

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    categories: getInitialCategories(),
    author: initialData?.author || "",
    readTime: initialData?.readTime || "5",
    cover_image: initialData?.cover_image || "",
    banner_image: initialData?.banner_image || "",
    meta_title: initialData?.meta_title || "",
    meta_description: initialData?.meta_description || "",
    meta_keywords: initialData?.meta_keywords || "",
    og_title: initialData?.og_title || "",
    og_description: initialData?.og_description || "",
    og_image: initialData?.og_image || "",
    tags: Array.isArray(initialData?.tags) ? initialData.tags : typeof initialData?.tags === 'string' ? initialData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    keywords: Array.isArray(initialData?.meta_keywords) ? initialData.meta_keywords : typeof initialData?.meta_keywords === 'string' ? initialData.meta_keywords.split(',').map(k => k.trim()).filter(Boolean) : [],
    is_published: initialData?.is_published || false,
    slug: initialData?.slug || "",
    faqs: initialData?.faqs || [] as FAQItem[],
    canonical_url: initialData?.canonical_url || "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [availableCategories, setAvailableCategories] = useState<BlogCategory[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [addingCategory, setAddingCategory] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [uploading, setUploading] = useState<Record<string, boolean>>({})

  // Tags state
  const [newTagName, setNewTagName] = useState("")
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // Keywords state  
  const [newKeywordName, setNewKeywordName] = useState("")
  const [availableKeywords, setAvailableKeywords] = useState<string[]>([])

  // Generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }, [])

  // Calculate SEO score
  const calculateSEOScore = useCallback(() => {
    let score = 0
    const checks = {
      hasTitle: formData.meta_title.length > 0,
      titleLength: formData.meta_title.length >= 30 && formData.meta_title.length <= 60,
      hasDescription: formData.meta_description.length > 0,
      descriptionLength: formData.meta_description.length >= 120 && formData.meta_description.length <= 160,
      hasKeywords: (formData.keywords as string[]).length > 0,
      hasContent: formData.content.length > 500,
      hasExcerpt: formData.content.length > 0,
      hasFeaturedImage: !!formData.cover_image || !!formData.banner_image,
    }

    if (checks.hasTitle) score += 15
    if (checks.titleLength) score += 10
    if (checks.hasDescription) score += 15
    if (checks.descriptionLength) score += 10
    if (checks.hasKeywords) score += 10
    if (checks.hasContent) score += 20
    if (checks.hasExcerpt) score += 10
    if (checks.hasFeaturedImage) score += 10

    return { score, checks }
  }, [formData])

  const seoData = calculateSEOScore()

  // Initialize available tags and keywords from initial data
  useEffect(() => {
    if (initialData?.tags) {
      const initialTags = Array.isArray(initialData.tags)
        ? initialData.tags
        : typeof initialData.tags === 'string'
          ? initialData.tags.split(',').map(t => t.trim()).filter(Boolean)
          : []
      setAvailableTags(initialTags)
    }
    if (initialData?.meta_keywords) {
      const initialKeywords = typeof initialData.meta_keywords === 'string'
        ? initialData.meta_keywords.split(',').map(k => k.trim()).filter(Boolean)
        : []
      setAvailableKeywords(initialKeywords)
    }
  }, [initialData])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/blog/categories")
        if (response.ok) {
          const data = await response.json()
          setAvailableCategories(data.categories || [])
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [])

  // Auto-save draft (every 60 seconds when content changes)
  useEffect(() => {
    if (!formData.title || formData.is_published) return

    if (autoSaveRef.current) clearTimeout(autoSaveRef.current)

    autoSaveRef.current = setTimeout(async () => {
      setAutoSaving(true)
      try {
        const url = isEditing ? `/api/admin/blog/posts/${initialData?._id}` : "/api/admin/blog/posts"
        const method = isEditing ? "PUT" : "POST"

        const payload = {
          ...formData,
          category: formData.categories,
          tags: formData.tags as string[],
          meta_keywords: (formData.keywords as string[]).join(", "),
          canonical_url: formData.canonical_url || "",
          is_published: false,
        }

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          setLastSaved(new Date())
        }
      } catch (err) {
        console.error("Auto-save failed:", err)
      } finally {
        setAutoSaving(false)
      }
    }, 60000)

    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
    }
  }, [formData, isEditing, initialData?._id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }
      // Auto-generate slug from title if not manually set
      if (name === "title" && !prev.slug) {
        newData.slug = generateSlug(value)
      }
      // Auto-fill meta title if empty
      if (name === "title" && !prev.meta_title) {
        newData.meta_title = value
      }
      return newData
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading((prev) => ({ ...prev, [fieldName]: true }))
    setError("")

    try {
      const uploadFormData = new FormData()
      uploadFormData.append("file", file)
      uploadFormData.append("folder", "blog")

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await response.json()
      setFormData((prev) => ({ ...prev, [fieldName]: data.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setUploading((prev) => ({ ...prev, [fieldName]: false }))
      e.target.value = ""
    }
  }

  const toggleCategory = (categoryName: string) => {
    setFormData((prev) => {
      const current = prev.categories
      if (current.includes(categoryName)) {
        return { ...prev, categories: current.filter((c) => c !== categoryName) }
      }
      return { ...prev, categories: [...current, categoryName] }
    })
  }

  const addNewCategory = async () => {
    if (!newCategoryName.trim()) return
    setAddingCategory(true)
    try {
      const response = await fetch("/api/admin/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      })
      if (response.ok) {
        const data = await response.json()
        setAvailableCategories((prev) => [...prev, data.category])
        setFormData((prev) => ({
          ...prev,
          categories: [...prev.categories, data.category.name],
        }))
        setNewCategoryName("")
      }
    } catch (err) {
      console.error("Failed to add category:", err)
    } finally {
      setAddingCategory(false)
    }
  }

  // Toggle tag selection
  const toggleTag = (tagName: string) => {
    setFormData((prev) => {
      const current = prev.tags as string[]
      if (current.includes(tagName)) {
        return { ...prev, tags: current.filter((t) => t !== tagName) }
      }
      return { ...prev, tags: [...current, tagName] }
    })
  }

  // Add new tag
  const addNewTag = () => {
    const trimmed = newTagName.trim()
    if (!trimmed) return
    const currentTags = formData.tags as string[]
    if (!currentTags.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags as string[]), trimmed],
      }))
      if (!availableTags.includes(trimmed)) {
        setAvailableTags((prev) => [...prev, trimmed])
      }
    }
    setNewTagName("")
  }

  // Toggle keyword selection
  const toggleKeyword = (keywordName: string) => {
    setFormData((prev) => {
      const current = prev.keywords as string[]
      if (current.includes(keywordName)) {
        return { ...prev, keywords: current.filter((k) => k !== keywordName) }
      }
      return { ...prev, keywords: [...current, keywordName] }
    })
  }

  // Add new keyword
  const addNewKeyword = () => {
    const trimmed = newKeywordName.trim()
    if (!trimmed) return
    const currentKeywords = formData.keywords as string[]
    if (!currentKeywords.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        keywords: [...(prev.keywords as string[]), trimmed],
      }))
      if (!availableKeywords.includes(trimmed)) {
        setAvailableKeywords((prev) => [...prev, trimmed])
      }
    }
    setNewKeywordName("")
  }

  const handleSubmit = async (publishStatus: boolean = true) => {
    if (!formData.title.trim()) {
      setError("Please enter a title for your post")
      return
    }

    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      const url = isEditing ? `/api/admin/blog/posts/${initialData?._id}` : "/api/admin/blog/posts"
      const method = isEditing ? "PUT" : "POST"

      // Generate schema markup for the blog post
      const schemaMarkup = generateBlogSchema({
        title: formData.title,
        content: formData.content,
        author: formData.author,
        slug: formData.slug || generateSlug(formData.title),
        cover_image: formData.cover_image,
        categories: formData.categories,
        tags: formData.tags as string[],
        faqs: formData.faqs
      })

      const payload = {
        ...formData,
        slug: formData.slug || "", // Explicitly include slug (empty string means auto-generate)
        category: formData.categories,
        tags: formData.tags as string[],
        meta_keywords: (formData.keywords as string[]).join(", "),
        canonical_url: formData.canonical_url || "",
        is_published: publishStatus,
        faqs: formData.faqs,
        schema_markup: schemaMarkup,
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || `Failed to ${isEditing ? "update" : "create"} blog post`)
      }

      setSuccess(true)
      setFormData((prev) => ({ ...prev, is_published: publishStatus }))

      setTimeout(() => {
        router.refresh()
        router.push("/admin/blog")
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    // Open preview in new tab
    const slug = formData.slug || generateSlug(formData.title)
    window.open(`/blogs/${slug}?preview=true`, "_blank")
  }

  // FAQ handlers
  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      id: crypto.randomUUID(),
      question: "",
      answer: ""
    }
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, newFaq]
    }))
  }

  const handleUpdateFaq = (id: string, field: "question" | "answer", value: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.map(faq =>
        faq.id === id ? { ...faq, [field]: value } : faq
      )
    }))
  }

  const handleRemoveFaq = (id: string) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter(faq => faq.id !== id)
    }))
  }

  // Generate schema markup
  const generatedSchemas = generateBlogSchema({
    title: formData.title,
    content: formData.content,
    author: formData.author,
    slug: formData.slug || generateSlug(formData.title),
    cover_image: formData.cover_image,
    categories: formData.categories,
    tags: formData.tags as string[],
    faqs: formData.faqs
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Toolbar - WordPress Style - Fixed */}
      <header className={cn(
        "fixed top-0 left-0 z-50 h-14 bg-card border-b border-border flex items-center justify-between px-4 shadow-sm transition-all duration-300",
        sidebarOpen ? "right-80" : "right-0"
      )}>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/blog")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">All Posts</span>
          </Button>

          <div className="h-6 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {autoSaving && (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </span>
            )}
            {lastSaved && !autoSaving && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Save Draft */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save Draft</span>
          </Button>

          {/* Preview */}
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            disabled={!formData.title}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
          </Button>

          {/* Publish/Update */}
          <Button
            size="sm"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span>{isEditing ? (formData.is_published ? "Update" : "Publish") : "Publish"}</span>
          </Button>

          <div className="h-6 w-px bg-border" />

          {/* Toggle Sidebar */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="gap-2"
          >
            {sidebarOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </header>

      {/* Status Messages */}
      {(error || success) && (
        <div className={cn(
          "px-4 py-2 text-sm flex items-center gap-2 justify-center",
          error ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-600"
        )}>
          {error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
          {error || "Post saved successfully!"}
        </div>
      )}

      {/* Main Content Area - with top padding for fixed header */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <main className={cn(
          "flex-1 overflow-y-auto transition-all duration-300",
          sidebarOpen ? "mr-80" : "mr-0"
        )}>
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Add title"
                className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/50 focus:ring-0"
              />
              <p className="text-sm text-muted-foreground">
                Permalink: /blogs/{formData.slug || generateSlug(formData.title) || "post-url"}
              </p>
            </div>

            {/* Block Editor Canvas */}
            <div className="max-h-[500px] border border-border rounded-lg overflow-y-auto bg-background">
              <EditorCanvas
                content={formData.content}
                onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                placeholder="Start writing or type '/' to insert a block..."
                onBlockSelect={(blockType, blockPos) => {
                  setSelectedBlockType(blockType)
                  setSelectedBlockPos(blockPos ?? null)
                  if (blockType) {
                    setActivePanel("block")
                  }
                }}
                onEditorReady={(editor) => setEditorInstance(editor)}
              />
            </div>

            {/* FAQ Section */}
            <FAQSection
              faqs={formData.faqs}
              onAddFaq={handleAddFaq}
              onUpdateFaq={handleUpdateFaq}
              onRemoveFaq={handleRemoveFaq}
            />
          </div>
        </main>

        {/* Right Sidebar - Fixed below header */}
        <aside className={cn(
          "w-80 border-l border-border bg-card transition-all duration-300 flex flex-col fixed top-14 right-0 bottom-0 z-40 overflow-hidden",
          sidebarOpen ? "translate-x-0" : "translate-x-full hidden"
        )}>
          {/* Sidebar Tabs */}
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => setActivePanel("post")}
              className={cn(
                "flex-1 px-3 py-3 text-sm font-medium transition-colors",
                activePanel === "post"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Settings2 className="h-4 w-4" />
                <span className="hidden lg:inline">Post</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActivePanel("block")}
              className={cn(
                "flex-1 px-3 py-3 text-sm font-medium transition-colors relative",
                activePanel === "block"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Layers className="h-4 w-4" />
                <span className="hidden lg:inline">Block</span>
                {selectedBlockType && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActivePanel("seo")}
              className={cn(
                "flex-1 px-3 py-3 text-sm font-medium transition-colors relative",
                activePanel === "seo"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center justify-center gap-1.5">
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">SEO</span>
                <span className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-medium",
                  seoData.score >= 80 ? "bg-green-500/20 text-green-600" :
                    seoData.score >= 50 ? "bg-yellow-500/20 text-yellow-600" :
                      "bg-red-500/20 text-red-600"
                )}>
                  {seoData.score}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActivePanel("toc")}
              className={cn(
                "flex-1 px-3 py-3 text-sm font-medium transition-colors relative",
                activePanel === "toc"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center justify-center gap-1.5">
                <ListTree className="h-4 w-4" />
                <span className="hidden lg:inline">TOC</span>
              </span>
            </button>
          </div>

          {/* Post Settings Panel */}
          {activePanel === "post" && (
            <div className="flex-1 overflow-y-auto pb-20">
              {/* Status */}
              <CollapsiblePanel title="Status" icon={FileText} defaultOpen>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Visibility</span>
                  <span className="text-sm font-medium">
                    {formData.is_published ? "Published" : "Draft"}
                  </span>
                </div>
              </CollapsiblePanel>

              {/* Author */}
              <CollapsiblePanel title="Author" icon={User} defaultOpen>
                <Input
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Author name"
                />
              </CollapsiblePanel>

              {/* Categories */}
              <CollapsiblePanel title="Categories" icon={Tag} defaultOpen>
                <div className="space-y-2">
                  {/* Add new category */}
                  <div className="flex gap-2">
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="New category..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addNewCategory()
                        }
                      }}
                      className="h-8 text-sm"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addNewCategory}
                      disabled={!newCategoryName.trim() || addingCategory}
                      className="h-8 px-2"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Selected categories */}
                  {formData.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {formData.categories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
                        >
                          {cat}
                          <button
                            type="button"
                            onClick={() => toggleCategory(cat)}
                            className="hover:text-primary/70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Category list */}
                  <div className="max-h-32 overflow-y-auto border border-border rounded-md">
                    {loadingCategories ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        Loading...
                      </div>
                    ) : availableCategories.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No categories yet
                      </div>
                    ) : (
                      <div className="p-1">
                        {availableCategories.map((cat) => (
                          <button
                            key={cat._id}
                            type="button"
                            onClick={() => toggleCategory(cat.name)}
                            className="w-full px-2 py-1.5 text-left text-sm hover:bg-muted rounded flex items-center justify-between"
                          >
                            <span>{cat.name}</span>
                            {formData.categories.includes(cat.name) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CollapsiblePanel>

              {/* Tags */}
              <CollapsiblePanel title="Tags" icon={Tag}>
                <div className="space-y-2">
                  {/* Add new tag */}
                  <div className="flex gap-2">
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="New tag..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addNewTag()
                        }
                      }}
                      className="h-8 text-sm"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addNewTag}
                      disabled={!newTagName.trim()}
                      className="h-8 px-2"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Selected tags */}
                  {(formData.tags as string[]).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(formData.tags as string[]).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className="hover:text-primary/70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tag list */}
                  {availableTags.length > 0 && (
                    <div className="max-h-32 overflow-y-auto border border-border rounded-md">
                      <div className="p-1">
                        {availableTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className="w-full px-2 py-1.5 text-left text-sm hover:bg-muted rounded flex items-center justify-between"
                          >
                            <span>{tag}</span>
                            {(formData.tags as string[]).includes(tag) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsiblePanel>

              {/* Featured Image */}
              <CollapsiblePanel title="Featured Image" icon={ImageIcon} defaultOpen>
                <p className="text-[10px] text-muted-foreground mb-2">Recommended: 800 x 450px (16:9)</p>
                <div className="space-y-3">
                  {formData.cover_image ? (
                    <div className="relative">
                      <img
                        src={formData.cover_image}
                        alt="Featured"
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => setFormData((prev) => ({ ...prev, cover_image: "" }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "cover_image")}
                        disabled={uploading.cover_image}
                        className="hidden"
                      />
                      {uploading.cover_image ? (
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
                          <span className="text-xs text-muted-foreground">Click to upload</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </CollapsiblePanel>

              {/* Banner Image */}
              <CollapsiblePanel title="Banner Image" icon={ImageIcon}>
                <p className="text-[10px] text-muted-foreground mb-2">Recommended: 1200 x 525px (16:7) - Hero display</p>
                <div className="space-y-3">
                  {formData.banner_image ? (
                    <div className="relative">
                      <img
                        src={formData.banner_image}
                        alt="Banner"
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => setFormData((prev) => ({ ...prev, banner_image: "" }))}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-border rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "banner_image")}
                        disabled={uploading.banner_image}
                        className="hidden"
                      />
                      {uploading.banner_image ? (
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      ) : (
                        <>
                          <ImageIcon className="h-5 w-5 text-muted-foreground mb-1" />
                          <span className="text-xs text-muted-foreground">Upload banner</span>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </CollapsiblePanel>

              {/* Read Time */}
              <CollapsiblePanel title="Read Time" icon={Clock}>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    min="1"
                    className="w-20 h-8 text-sm"
                  />
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
              </CollapsiblePanel>

              {/* Slug */}
              <CollapsiblePanel title="URL Slug" icon={Globe}>
                <div className="space-y-2">
                  <div className="relative">
                    <Input
                      name="slug"
                      value={formData.slug}
                      onChange={(e) => {
                        // Auto-convert typed text to slug format
                        const value = e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                          .replace(/-+/g, "-")
                          .replace(/(^-|-$)/g, "")
                        setFormData(prev => ({ ...prev, slug: value }))
                      }}
                      onKeyDown={(e) => {
                        // Convert spacebar to hyphen
                        if (e.key === " " || e.code === "Space") {
                          e.preventDefault()
                          const input = e.currentTarget
                          const start = input.selectionStart || 0
                          const end = input.selectionEnd || 0
                          const currentValue = formData.slug
                          // Only add hyphen if not at start and previous char is not already a hyphen
                          if (start > 0 && currentValue[start - 1] !== "-") {
                            const newValue = currentValue.slice(0, start) + "-" + currentValue.slice(end)
                            setFormData(prev => ({ ...prev, slug: newValue }))
                            // Set cursor position after the hyphen
                            setTimeout(() => {
                              input.setSelectionRange(start + 1, start + 1)
                            }, 0)
                          }
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault()
                        const pastedText = e.clipboardData.getData("text")
                        const slug = pastedText
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")
                          .replace(/-+/g, "-")
                          .replace(/(^-|-$)/g, "")
                        setFormData(prev => ({ ...prev, slug }))
                      }}
                      placeholder="post-url-slug"
                      className="h-8 text-sm pr-20"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        const slug = generateSlug(formData.title)
                        setFormData(prev => ({ ...prev, slug }))
                      }}
                    >
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paste a title or type to auto-format as URL slug. Leave empty to auto-generate from title.
                  </p>
                </div>
              </CollapsiblePanel>
            </div>
          )}

          {/* Block Settings Panel */}
          {activePanel === "block" && (
            <div className="flex-1 overflow-y-auto pb-20">
              {selectedBlockType ? (
                <BlockSettingsPanel
                  blockType={selectedBlockType}
                  blockPos={selectedBlockPos}
                  onClose={() => {
                    setSelectedBlockType(null)
                    setSelectedBlockPos(null)
                    setActivePanel("post")
                  }}
                  editor={editorInstance}
                />
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm font-medium mb-1">No block selected</p>
                  <p className="text-xs">Click on a block in the editor to see its settings here.</p>
                </div>
              )}
            </div>
          )}

          {/* SEO Panel */}
          {activePanel === "seo" && (
            <div className="flex-1 overflow-y-auto pb-20">
              {/* SEO Score */}
              <div className="p-4 border-b border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SEO Score</span>
                  <span className={cn(
                    "text-lg font-bold",
                    seoData.score >= 80 ? "text-green-600" :
                      seoData.score >= 50 ? "text-yellow-600" :
                        "text-red-600"
                  )}>
                    {seoData.score}/100
                  </span>
                </div>
                <SEOScore score={seoData.score} label={
                  seoData.score >= 80 ? "Good" :
                    seoData.score >= 50 ? "OK" : "Needs Work"
                } />
              </div>

              {/* Google Preview */}
              <div className="p-4 border-b border-border">
                <GooglePreview
                  title={formData.meta_title || formData.title}
                  slug={formData.slug || generateSlug(formData.title)}
                  description={formData.meta_description || extractExcerptFromContent(formData.content, 160)}
                />
              </div>

              {/* Schema Markup Preview */}
              <div className="p-4 border-b border-border">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Braces className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Schema Markup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-600 rounded-full">
                        {generatedSchemas.length} {generatedSchemas.length === 1 ? "Schema" : "Schemas"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {generatedSchemas.map((schema, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-muted rounded-md"
                      >
                        {(schema as { "@type"?: string })["@type"]}
                      </span>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSchemaPreview(true)}
                    className="w-full gap-2"
                  >
                    <Braces className="h-4 w-4" />
                    Preview Schema Markup
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Schema markup will be automatically embedded when the post is published.
                    {formData.faqs.length > 0 && (
                      <span className="block mt-1 text-green-600">
                        FAQ Schema included with {formData.faqs.length} question(s).
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* SEO Fields */}
              <CollapsiblePanel title="SEO Title" icon={FileText} defaultOpen>
                <div className="space-y-2">
                  <Input
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleChange}
                    placeholder="SEO title (50-60 characters)"
                    className="h-8 text-sm"
                  />
                  <div className="flex justify-between text-xs">
                    <span className={cn(
                      formData.meta_title.length >= 30 && formData.meta_title.length <= 60
                        ? "text-green-600" : "text-muted-foreground"
                    )}>
                      {formData.meta_title.length} characters
                    </span>
                    <span className="text-muted-foreground">Recommended: 50-60</span>
                  </div>
                </div>
              </CollapsiblePanel>

              <CollapsiblePanel title="Meta Description" icon={FileText} defaultOpen>
                <div className="space-y-2">
                  <Textarea
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleChange}
                    placeholder="Meta description (120-160 characters)"
                    className="min-h-[80px] text-sm resize-none"
                  />
                  <div className="flex justify-between text-xs">
                    <span className={cn(
                      formData.meta_description.length >= 120 && formData.meta_description.length <= 160
                        ? "text-green-600" : "text-muted-foreground"
                    )}>
                      {formData.meta_description.length} characters
                    </span>
                    <span className="text-muted-foreground">Recommended: 120-160</span>
                  </div>
                </div>
              </CollapsiblePanel>

              <CollapsiblePanel title="Canonical URL" icon={Globe} defaultOpen>
                <div className="space-y-2">
                  <Input
                    name="canonical_url"
                    value={formData.canonical_url}
                    onChange={handleChange}
                    placeholder="https://example.com/blogs/post-slug"
                    className="h-8 text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Set a canonical URL to indicate the preferred version of this page. Leave empty to use the default page URL.
                  </p>
                </div>
              </CollapsiblePanel>

              <CollapsiblePanel title="Focus Keywords" icon={Search}>
                <div className="space-y-2">
                  {/* Add new keyword */}
                  <div className="flex gap-2">
                    <Input
                      value={newKeywordName}
                      onChange={(e) => setNewKeywordName(e.target.value)}
                      placeholder="New keyword..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addNewKeyword()
                        }
                      }}
                      className="h-8 text-sm"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={addNewKeyword}
                      disabled={!newKeywordName.trim()}
                      className="h-8 px-2"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Selected keywords */}
                  {(formData.keywords as string[]).length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {(formData.keywords as string[]).map((keyword) => (
                        <span
                          key={keyword}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full"
                        >
                          {keyword}
                          <button
                            type="button"
                            onClick={() => toggleKeyword(keyword)}
                            className="hover:text-primary/70"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Keyword list */}
                  {availableKeywords.length > 0 && (
                    <div className="max-h-32 overflow-y-auto border border-border rounded-md">
                      <div className="p-1">
                        {availableKeywords.map((keyword) => (
                          <button
                            key={keyword}
                            type="button"
                            onClick={() => toggleKeyword(keyword)}
                            className="w-full px-2 py-1.5 text-left text-sm hover:bg-muted rounded flex items-center justify-between"
                          >
                            <span>{keyword}</span>
                            {(formData.keywords as string[]).includes(keyword) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CollapsiblePanel>

              {/* Open Graph */}
              <CollapsiblePanel title="Social Sharing" icon={Globe}>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">OG Title</label>
                    <Input
                      name="og_title"
                      value={formData.og_title}
                      onChange={handleChange}
                      placeholder="Social media title"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">OG Description</label>
                    <Textarea
                      name="og_description"
                      value={formData.og_description}
                      onChange={handleChange}
                      placeholder="Social media description"
                      className="min-h-[60px] text-sm resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">OG Image</label>
                    <p className="text-xs text-muted-foreground">
                      Upload or enter URL. Recommended: 1200x630px
                    </p>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center justify-center px-3 py-1.5 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors text-xs font-medium">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, "og_image")}
                          disabled={uploading.og_image}
                          className="hidden"
                        />
                        {uploading.og_image ? "Uploading..." : "Upload"}
                      </label>
                      {formData.og_image && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setFormData((prev) => ({ ...prev, og_image: "" }))}
                          className="h-7 text-xs"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <Input
                      name="og_image"
                      value={formData.og_image}
                      onChange={handleChange}
                      placeholder="Or enter image URL..."
                      className="h-8 text-sm"
                    />
                    {formData.og_image && (
                      <div className="mt-2">
                        <img
                          src={formData.og_image}
                          alt="OG Image preview"
                          className="w-full h-auto rounded-md border border-border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CollapsiblePanel>

              {/* SEO Checklist */}
              <CollapsiblePanel title="SEO Checklist" icon={Sparkles} defaultOpen>
                <div className="space-y-2">
                  {[
                    { check: seoData.checks.hasTitle, label: "Has SEO title" },
                    { check: seoData.checks.titleLength, label: "Title length is optimal" },
                    { check: seoData.checks.hasDescription, label: "Has meta description" },
                    { check: seoData.checks.descriptionLength, label: "Description length is optimal" },
                    { check: seoData.checks.hasKeywords, label: "Has focus keywords" },
                    { check: seoData.checks.hasContent, label: "Content is long enough" },
                    { check: seoData.checks.hasExcerpt, label: "Has content (excerpt auto-generated)" },
                    { check: seoData.checks.hasFeaturedImage, label: "Has featured image" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {item.check ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={item.check ? "text-foreground" : "text-muted-foreground"}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CollapsiblePanel>
            </div>
          )}

          {/* TOC Panel */}
          {activePanel === "toc" && (
            <div className="flex-1 overflow-y-auto pb-20">
              {/* Table of Contents */}
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <ListTree className="h-4 w-4" />
                  Table of Contents
                </h3>
                {(() => {
                  // Parse headings from content
                  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h[1-6]>/gi
                  const headings: { level: number; text: string }[] = []
                  let match
                  const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null

                  while ((match = headingRegex.exec(formData.content)) !== null) {
                    // Strip HTML tags from heading text
                    let text = match[2]
                    if (tempDiv) {
                      tempDiv.innerHTML = text
                      text = tempDiv.textContent || tempDiv.innerText || ''
                    } else {
                      text = text.replace(/<[^>]*>/g, '')
                    }
                    headings.push({ level: parseInt(match[1]), text: text.trim() })
                  }

                  const h1Count = headings.filter(h => h.level === 1).length
                  const h2Count = headings.filter(h => h.level === 2).length
                  const h3Count = headings.filter(h => h.level === 3).length

                  return (
                    <div className="space-y-3">
                      {headings.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No headings found in content</p>
                      ) : (
                        <>
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {headings.map((heading, idx) => (
                              <div
                                key={idx}
                                className="flex items-start gap-2 text-sm"
                                style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
                              >
                                <span className="text-muted-foreground text-xs mt-0.5">
                                  {heading.level === 1 ? '●' : heading.level === 2 ? '○' : '◦'}
                                </span>
                                <span className="text-foreground truncate">{heading.text || '(empty)'}</span>
                              </div>
                            ))}
                          </div>
                          <div className="pt-3 border-t border-border space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">Content Structure:</p>
                            <div className="grid grid-cols-2 gap-1 text-xs">
                              <span className="text-muted-foreground">H1: {h1Count} sections</span>
                              <span className="text-muted-foreground">H2: {h2Count} subsections</span>
                              <span className="text-muted-foreground">H3: {h3Count} details</span>
                              <span className="font-medium">Total: {headings.length}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })()}
              </div>

              {/* Images in Content */}
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Content Images
                </h3>
                {(() => {
                  // Parse images from content
                  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*(?:width="(\d+)")?[^>]*(?:height="(\d+)")?[^>]*>/gi
                  const images: { src: string; width?: string; height?: string; alt?: string }[] = []
                  let match

                  // Reset regex lastIndex
                  imgRegex.lastIndex = 0

                  const content = formData.content
                  while ((match = imgRegex.exec(content)) !== null) {
                    const fullTag = match[0]
                    const src = match[1]

                    // Extract width, height, and alt from the full tag
                    const widthMatch = fullTag.match(/width="(\d+)"/)
                    const heightMatch = fullTag.match(/height="(\d+)"/)
                    const altMatch = fullTag.match(/alt="([^"]*)"/)

                    images.push({
                      src,
                      width: widthMatch?.[1],
                      height: heightMatch?.[1],
                      alt: altMatch?.[1]
                    })
                  }

                  return (
                    <div className="space-y-3">
                      {images.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No images found in content</p>
                      ) : (
                        <>
                          <p className="text-xs text-muted-foreground">{images.length} image(s) in content</p>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {images.map((img, idx) => (
                              <div key={idx} className="flex gap-2 p-2 bg-muted/50 rounded-md">
                                <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                                  <img
                                    src={img.src}
                                    alt={img.alt || `Image ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate" title={img.alt || img.src}>
                                    {img.alt || `Image ${idx + 1}`}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {img.width && img.height
                                      ? `${img.width} x ${img.height}px`
                                      : img.width
                                        ? `Width: ${img.width}px`
                                        : img.height
                                          ? `Height: ${img.height}px`
                                          : 'Size: Auto'}
                                  </p>
                                  <p className="text-xs text-muted-foreground truncate" title={img.src}>
                                    {img.src.length > 30 ? '...' + img.src.slice(-27) : img.src}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )
                })()}
              </div>

              {/* Content Stats */}
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Content Statistics
                </h3>
                {(() => {
                  // Calculate content stats
                  const tempDiv = typeof document !== 'undefined' ? document.createElement('div') : null
                  let plainText = formData.content
                  if (tempDiv) {
                    tempDiv.innerHTML = formData.content
                    plainText = tempDiv.textContent || tempDiv.innerText || ''
                  } else {
                    plainText = formData.content.replace(/<[^>]*>/g, ' ')
                  }

                  const wordCount = plainText.trim().split(/\s+/).filter(w => w.length > 0).length
                  const charCount = plainText.length
                  const paragraphCount = (formData.content.match(/<p[^>]*>/gi) || []).length
                  const linkCount = (formData.content.match(/<a[^>]*>/gi) || []).length
                  const listCount = (formData.content.match(/<[uo]l[^>]*>/gi) || []).length
                  const codeBlockCount = (formData.content.match(/<pre[^>]*>/gi) || []).length
                  const tableCount = (formData.content.match(/<table[^>]*>/gi) || []).length
                  const blockquoteCount = (formData.content.match(/<blockquote[^>]*>/gi) || []).length
                  const readTime = Math.max(1, Math.ceil(wordCount / 200))

                  return (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Words:</span>
                        <span className="font-medium">{wordCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Characters:</span>
                        <span className="font-medium">{charCount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paragraphs:</span>
                        <span className="font-medium">{paragraphCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Links:</span>
                        <span className="font-medium">{linkCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Lists:</span>
                        <span className="font-medium">{listCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Code blocks:</span>
                        <span className="font-medium">{codeBlockCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tables:</span>
                        <span className="font-medium">{tableCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Quotes:</span>
                        <span className="font-medium">{blockquoteCount}</span>
                      </div>
                      <div className="col-span-2 pt-2 mt-2 border-t border-border flex justify-between">
                        <span className="text-muted-foreground">Est. read time:</span>
                        <span className="font-medium">{readTime} min</span>
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Schema Preview Modal */}
      <SchemaPreviewModal
        isOpen={showSchemaPreview}
        onClose={() => setShowSchemaPreview(false)}
        schemas={generatedSchemas}
      />
    </div>
  )
}
