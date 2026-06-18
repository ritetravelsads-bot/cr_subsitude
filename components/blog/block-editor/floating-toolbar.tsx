"use client"

import type { Editor } from "@tiptap/core"
import { cn } from "@/lib/utils"
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  List,
  Minus,
  Maximize2,
  Minimize2,
  ImageIcon,
  RectangleHorizontal,
  ChevronDown,
  Link,
  Trash2
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface FloatingToolbarProps {
  editor: Editor
  position: { top: number; left: number }
  blockType: string
}

export function FloatingToolbar({ editor, position, blockType }: FloatingToolbarProps) {
  const [showSizeMenu, setShowSizeMenu] = useState(false)
  const [customWidth, setCustomWidth] = useState("")
  const [customHeight, setCustomHeight] = useState("")
  const [lockAspectRatio, setLockAspectRatio] = useState(true)
  const toolbarRef = useRef<HTMLDivElement>(null)

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowSizeMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const imageSizeOptions = [
    { size: "small", label: "25%", width: "25%" },
    { size: "medium", label: "50%", width: "50%" },
    { size: "large", label: "75%", width: "75%" },
    { size: "full", label: "100%", width: "100%" },
    { size: "original", label: "Auto", width: "auto" }
  ]

  const pixelSizePresets = [150, 300, 450, 600, 800, 1024]

  // Helper to get the image position from current selection
  const getImagePos = (): number | null => {
    const { selection } = editor.state
    const node = editor.state.doc.nodeAt(selection.from)
    if (node?.type.name === "image") {
      return selection.from
    }
    return null
  }

  const handleImageSize = (width: string) => {
    const imagePos = getImagePos()
    if (imagePos !== null) {
      editor.chain().setNodeSelection(imagePos).updateAttributes("image", {
        style: width === "auto" ? "" : `width: ${width}; max-width: 100%;`
      }).run()
    }
    setShowSizeMenu(false)
  }

  const handleImagePixelSize = (widthPx: number) => {
    const imagePos = getImagePos()
    if (imagePos !== null) {
      editor.chain().setNodeSelection(imagePos).updateAttributes("image", {
        style: `width: ${widthPx}px; max-width: 100%;`
      }).run()
    }
    setCustomWidth(widthPx.toString())
  }

  const handleCustomSizeApply = () => {
    const w = parseInt(customWidth)
    const h = parseInt(customHeight)
    if (w > 0) {
      const style = h > 0
        ? `width: ${w}px; height: ${h}px; max-width: 100%;`
        : `width: ${w}px; max-width: 100%;`
      const imagePos = getImagePos()
      if (imagePos !== null) {
        editor.chain().setNodeSelection(imagePos).updateAttributes("image", { style }).run()
      }
      setShowSizeMenu(false)
    }
  }

  // Computed position
  const toolbarStyle: React.CSSProperties = {
    position: "absolute",
    top: Math.max(0, position.top - 44),
    left: Math.max(8, position.left),
    zIndex: 50
  }

  // IMAGE toolbar
  if (blockType === "image") {
    return (
      <div
        ref={toolbarRef}
        className="absolute z-50 bg-card border border-border rounded-md shadow-lg flex items-center gap-0.5 p-1"
        style={toolbarStyle}
      >
        {/* Size dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSizeMenu(!showSizeMenu)}
            className="flex items-center gap-1 px-2 py-1 hover:bg-muted text-xs font-medium rounded"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Size
            <ChevronDown className="h-3 w-3" />
          </button>
          {showSizeMenu && (
            <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-md shadow-lg py-1 w-56 z-50">
              {/* Percentage */}
              <div className="px-2 py-1 text-[10px] text-muted-foreground font-medium uppercase">Width %</div>
              <div className="px-2 pb-1 flex gap-1">
                {imageSizeOptions.map((opt) => (
                  <button
                    key={opt.size}
                    type="button"
                    onClick={() => handleImageSize(opt.width)}
                    className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="border-t border-border my-1" />

              {/* Pixel presets */}
              <div className="px-2 py-1 text-[10px] text-muted-foreground font-medium uppercase">Width px</div>
              <div className="px-2 pb-1 flex flex-wrap gap-1">
                {pixelSizePresets.map((px) => (
                  <button
                    key={px}
                    type="button"
                    onClick={() => handleImagePixelSize(px)}
                    className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded"
                  >
                    {px}
                  </button>
                ))}
              </div>

              <div className="border-t border-border my-1" />

              {/* Custom */}
              <div className="px-2 py-1 text-[10px] text-muted-foreground font-medium uppercase">Custom px</div>
              <div className="px-2 pb-2 flex items-center gap-1">
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  placeholder="W"
                  min="1"
                  className="w-16 px-2 py-1 text-xs border border-border rounded bg-background"
                />
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={cn(
                    "p-1 rounded",
                    lockAspectRatio ? "text-primary" : "text-muted-foreground"
                  )}
                  title="Lock ratio"
                >
                  <Link className="h-3 w-3" />
                </button>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  placeholder="H"
                  min="1"
                  className="w-16 px-2 py-1 text-xs border border-border rounded bg-background"
                />
                <button
                  type="button"
                  onClick={handleCustomSizeApply}
                  disabled={!customWidth}
                  className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded disabled:opacity-50"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-border" />

        {/* Delete */}
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteSelection().run()}
          className="p-1.5 rounded hover:bg-muted text-destructive"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  // TEXT toolbar - only H1, H2, H3, H4, divider, bullet list
  return (
    <div
      ref={toolbarRef}
      className="absolute z-50 bg-card border border-border rounded-md shadow-lg flex items-center gap-0.5 p-1"
      style={toolbarStyle}
    >
      {/* Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn(
          "p-1.5 rounded hover:bg-muted",
          editor.isActive("heading", { level: 1 }) && "bg-primary/10 text-primary"
        )}
        title="H1"
      >
        <Heading1 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cn(
          "p-1.5 rounded hover:bg-muted",
          editor.isActive("heading", { level: 2 }) && "bg-primary/10 text-primary"
        )}
        title="H2"
      >
        <Heading2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cn(
          "p-1.5 rounded hover:bg-muted",
          editor.isActive("heading", { level: 3 }) && "bg-primary/10 text-primary"
        )}
        title="H3"
      >
        <Heading3 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={cn(
          "p-1.5 rounded hover:bg-muted",
          editor.isActive("heading", { level: 4 }) && "bg-primary/10 text-primary"
        )}
        title="H4"
      >
        <Heading4 className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-border mx-0.5" />

      {/* Divider */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-1.5 rounded hover:bg-muted"
        title="Divider"
      >
        <Minus className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-border mx-0.5" />

      {/* Bullet List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          "p-1.5 rounded hover:bg-muted",
          editor.isActive("bulletList") && "bg-primary/10 text-primary"
        )}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  )
}
