"use client"

// WordPress-style Block Editor Canvas Component
import { useEditor, EditorContent } from "@tiptap/react"
import { NodeSelection } from "@tiptap/pm/state"
import { StarterKit } from "@tiptap/starter-kit"
import { Placeholder } from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"

// Extend Image extension to support style attribute for resizing
const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
          if (!attributes.style) {
            return {}
          }
          return { style: attributes.style }
        },
      },
    }
  },
})
import { Link } from "@tiptap/extension-link"
import { TextAlign } from "@tiptap/extension-text-align"
import { Underline } from "@tiptap/extension-underline"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import { Color } from "@tiptap/extension-color"
import { TextStyle } from "@tiptap/extension-text-style"
import { Highlight } from "@tiptap/extension-highlight"
import { useCallback, useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { FloatingToolbar } from "./floating-toolbar"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Undo,
  Redo,
  SeparatorHorizontal,
  Pilcrow,
  ChevronDown,
  X
} from "lucide-react"

interface EditorCanvasProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
  onBlockSelect?: (blockType: string | null, blockPos?: number | null) => void
  onEditorReady?: (editor: ReturnType<typeof useEditor>) => void
}

// Table size picker component
function TableSizePicker({
  onSelect,
  onClose
}: {
  onSelect: (rows: number, cols: number) => void
  onClose: () => void
}) {
  const [hovered, setHovered] = useState({ rows: 0, cols: 0 })
  const MAX_ROWS = 8
  const MAX_COLS = 8

  return (
    <div className="p-3 bg-card border border-border rounded-lg shadow-xl">
      <div className="text-xs text-muted-foreground mb-2 font-medium">
        {hovered.rows > 0 && hovered.cols > 0
          ? `${hovered.rows} × ${hovered.cols} table`
          : "Select table size"}
      </div>
      <div
        className="grid gap-0.5"
        style={{ gridTemplateColumns: `repeat(${MAX_COLS}, 1fr)` }}
        onMouseLeave={() => setHovered({ rows: 0, cols: 0 })}
      >
        {Array.from({ length: MAX_ROWS }).map((_, rowIdx) =>
          Array.from({ length: MAX_COLS }).map((_, colIdx) => (
            <button
              key={`${rowIdx}-${colIdx}`}
              type="button"
              className={cn(
                "w-6 h-6 border rounded-sm transition-colors",
                rowIdx < hovered.rows && colIdx < hovered.cols
                  ? "bg-primary/20 border-primary/50"
                  : "bg-muted/40 border-border hover:bg-muted"
              )}
              onMouseEnter={() => setHovered({ rows: rowIdx + 1, cols: colIdx + 1 })}
              onClick={() => {
                onSelect(rowIdx + 1, colIdx + 1)
                onClose()
              }}
            />
          ))
        )}
      </div>
      <div className="mt-2 pt-2 border-t border-border">
        <button
          type="button"
          className="w-full text-xs text-muted-foreground hover:text-foreground py-1 text-center"
          onClick={() => {
            const rows = parseInt(window.prompt("Rows:", "3") || "3")
            const cols = parseInt(window.prompt("Columns:", "3") || "3")
            if (rows > 0 && cols > 0) {
              onSelect(rows, cols)
              onClose()
            }
          }}
        >
          Custom size...
        </button>
      </div>
    </div>
  )
}

export function EditorCanvas({
  content,
  onChange,
  placeholder = "Start writing or type '/' to insert a block...",
  className,
  onBlockSelect,
  onEditorReady
}: EditorCanvasProps) {
  const [activeBlock, setActiveBlock] = useState<{
    type: string
    attrs: Record<string, any>
    pos: { top: number; left: number }
  } | null>(null)

  // Slash menu state
  const [showSlashMenu, setShowSlashMenu] = useState(false)
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 })
  const [slashQuery, setSlashQuery] = useState("")
  const [slashMenuSelected, setSlashMenuSelected] = useState(0)
  const slashStartPosRef = useRef<number | null>(null)

  // Table picker state
  const [showTablePicker, setShowTablePicker] = useState(false)
  const [tableBtnRef, setTableBtnRef] = useState<HTMLButtonElement | null>(null)

  // Floating toolbar visibility
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false)
  const editorContainerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
          HTMLAttributes: {
            class: "wp-block wp-block-heading block-editor-rich-text__editable"
          }
        },
        paragraph: {
          HTMLAttributes: {
            class: "wp-block wp-block-paragraph block-editor-rich-text__editable"
          }
        },
        blockquote: {
          HTMLAttributes: {
            class: "wp-block wp-block-quote"
          }
        },
        bulletList: {
          HTMLAttributes: {
            class: "wp-block wp-block-list"
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: "wp-block wp-block-list"
          }
        },
        codeBlock: {
          HTMLAttributes: {
            class: "wp-block wp-block-code"
          }
        },
        horizontalRule: {
          HTMLAttributes: {
            class: "wp-block wp-block-separator"
          }
        }
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") return "Heading"
          return placeholder
        },
        emptyEditorClass: "is-editor-empty",
        emptyNodeClass: "is-empty"
      }),
CustomImage.configure({
  HTMLAttributes: { class: "wp-block wp-block-image" },
  allowBase64: true
  }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "rte-link" }
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Table.configure({
        HTMLAttributes: { class: "wp-block wp-block-table" },
        resizable: true
      }),
      TableRow,
      TableCell,
      TableHeader,
      Color,
      TextStyle,
      Highlight.configure({
        multicolor: true,
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    onSelectionUpdate: ({ editor }) => {
      const { from } = editor.state.selection
      const node = editor.state.doc.nodeAt(from)
      const resolvedPos = editor.state.doc.resolve(from)

      if (node) {
        const domNode = editor.view.nodeDOM(from) as HTMLElement
        if (domNode) {
          const rect = domNode.getBoundingClientRect()
          const containerRect = editorContainerRef.current?.getBoundingClientRect()
          setActiveBlock({
            type: node.type.name,
            attrs: node.attrs,
            pos: {
              top: rect.top - (containerRect?.top ?? 0),
              left: rect.left - (containerRect?.left ?? 0)
            }
          })
          onBlockSelect?.(node.type.name, from)
        }
      } else {
        const parent = resolvedPos.parent
        if (parent) {
          setActiveBlock({
            type: parent.type.name,
            attrs: parent.attrs,
            pos: { top: 0, left: 0 }
          })
          onBlockSelect?.(parent.type.name, null)
        }
      }

      // Show floating toolbar when there's a text selection OR when an image/block is selected
      const { empty } = editor.state.selection
      const selectionFrom = editor.state.selection.from
      const isNodeSelection = editor.state.selection.constructor.name === "NodeSelection"
      const isImageSelected = editor.isActive("image")
      
      // Calculate toolbar position from selection
      if (!empty || isNodeSelection || isImageSelected) {
        try {
          const coords = editor.view.coordsAtPos(selectionFrom)
          const editorRect = editorContainerRef.current?.getBoundingClientRect()
          if (editorRect) {
            setActiveBlock(prev => prev ? ({
              ...prev,
              pos: {
                top: coords.top - editorRect.top,
                left: coords.left - editorRect.left
              }
            }) : null)
          }
        } catch (e) {
          // Ignore coord errors
        }
      }
      
      // Show toolbar for text selections OR image/node selections
      setShowFloatingToolbar(!empty || isNodeSelection || isImageSelected)
    },
    editorProps: {
      attributes: {
        class: cn(
          "editor-styles-wrapper block-editor-writing-flow",
          "focus:outline-none min-h-[400px] p-4"
        ),
        "data-is-drop-zone": "true"
      },
      handleClick: (view, pos, event) => {
        // Check if clicking on an image
        const node = view.state.doc.nodeAt(pos)
        if (node?.type.name === "image") {
          // Select the image node using NodeSelection
          const tr = view.state.tr.setSelection(
            NodeSelection.create(view.state.doc, pos)
          )
          view.dispatch(tr)
          
          // Update active block and show toolbar
          const domNode = view.nodeDOM(pos) as HTMLElement
          if (domNode) {
            const rect = domNode.getBoundingClientRect()
            const containerRect = editorContainerRef.current?.getBoundingClientRect()
            setActiveBlock({
              type: "image",
              attrs: node.attrs,
              pos: {
                top: rect.top - (containerRect?.top ?? 0),
                left: rect.left - (containerRect?.left ?? 0)
              }
            })
            setShowFloatingToolbar(true)
            onBlockSelect?.("image", pos)
          }
          return true
        }
        return false
      },
      handleKeyDown: (view, event) => {
        const { state } = view
        const { selection } = state
        const { $from } = selection

        // ---- Keyboard shortcuts ----
        const isCtrl = event.ctrlKey || event.metaKey

        if (isCtrl && !event.altKey && !event.shiftKey) {
          if (event.key === "k" || event.key === "K") {
            event.preventDefault()
            const previousUrl = editor?.getAttributes("link").href
            const url = window.prompt("Enter link URL:", previousUrl || "https://")
            if (url === null) return true
            if (url === "") {
              editor?.chain().focus().extendMarkRange("link").unsetLink().run()
              return true
            }
            editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
            return true
          }
        }

        if (isCtrl && event.altKey) {
          switch (event.key) {
            case "1":
              event.preventDefault()
              editor?.chain().focus().toggleHeading({ level: 1 }).run()
              return true
            case "2":
              event.preventDefault()
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
              return true
            case "3":
              event.preventDefault()
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
              return true
            case "7":
              event.preventDefault()
              editor?.chain().focus().toggleOrderedList().run()
              return true
            case "8":
              event.preventDefault()
              editor?.chain().focus().toggleBulletList().run()
              return true
          }
        }

        if (isCtrl && event.shiftKey) {
          switch (event.key) {
            case "2":
              event.preventDefault()
              editor?.chain().focus().toggleHeading({ level: 2 }).run()
              return true
            case "3":
              event.preventDefault()
              editor?.chain().focus().toggleHeading({ level: 3 }).run()
              return true
            case "7":
              event.preventDefault()
              editor?.chain().focus().toggleOrderedList().run()
              return true
            case "8":
              event.preventDefault()
              editor?.chain().focus().toggleBulletList().run()
              return true
          }
        }

        // ---- Slash menu navigation ----
        if (showSlashMenu) {
          const filtered = getFilteredBlocks(slashQuery)

          if (event.key === "ArrowDown") {
            event.preventDefault()
            setSlashMenuSelected((prev) => (prev + 1) % filtered.length)
            return true
          }
          if (event.key === "ArrowUp") {
            event.preventDefault()
            setSlashMenuSelected((prev) => (prev - 1 + filtered.length) % filtered.length)
            return true
          }
          if (event.key === "Enter") {
            event.preventDefault()
            const block = filtered[slashMenuSelected]
            if (block) {
              insertBlock(block.type)
            }
            return true
          }
          if (event.key === "Escape") {
            setShowSlashMenu(false)
            slashStartPosRef.current = null
            setSlashQuery("")
            return true
          }
          // Keep track of what is typed after "/"
          if (event.key === "Backspace") {
            if (slashQuery.length === 0) {
              // Backspacing over the "/" char — close menu
              setShowSlashMenu(false)
              slashStartPosRef.current = null
              return false
            }
            setSlashQuery((prev) => prev.slice(0, -1))
            return false
          }
          if (event.key.length === 1) {
            setSlashQuery((prev) => prev + event.key)
            setSlashMenuSelected(0)
            return false
          }
          return false
        }

        // Open slash menu on "/"
        if (event.key === "/" && !editor?.isActive("codeBlock")) {
          // Record position for later deletion
          slashStartPosRef.current = $from.pos
          setSlashQuery("")
          setSlashMenuSelected(0)

          // Position the menu near the cursor
          const coords = view.coordsAtPos($from.pos)
          const containerRect = editorContainerRef.current?.getBoundingClientRect()
          if (containerRect) {
            setSlashMenuPos({
              top: coords.bottom - containerRect.top - 60 + 4,
              left: Math.max(0, coords.left - containerRect.left)
            })
          }

          setShowSlashMenu(true)
          return false
        }

        return false
      }
    }
  })

  // ---- Slash menu filter ----
  const blockTypes = [
    { type: "paragraph", label: "Paragraph", icon: Pilcrow, description: "Plain text block", keywords: ["text", "p"] },
    { type: "heading1", label: "Heading 1", icon: Heading1, description: "Large section heading", keywords: ["h1", "title"] },
    { type: "heading2", label: "Heading 2", icon: Heading2, description: "Medium section heading", keywords: ["h2"] },
    { type: "heading3", label: "Heading 3", icon: Heading3, description: "Small section heading", keywords: ["h3"] },
    { type: "bulletList", label: "Bullet List", icon: List, description: "Unordered list", keywords: ["ul", "list"] },
    { type: "orderedList", label: "Numbered List", icon: ListOrdered, description: "Ordered list", keywords: ["ol", "number"] },
    { type: "blockquote", label: "Quote", icon: Quote, description: "Quotation block", keywords: ["quote", "bq"] },
    { type: "codeBlock", label: "Code Block", icon: Code, description: "Code snippet", keywords: ["code", "pre"] },
    { type: "image", label: "Image", icon: ImageIcon, description: "Upload or embed image", keywords: ["img", "photo"] },
    { type: "table", label: "Table", icon: TableIcon, description: "Insert a table", keywords: ["grid"] },
    { type: "horizontalRule", label: "Divider", icon: Minus, description: "Horizontal rule", keywords: ["hr", "line", "rule"] }
  ]

  const getFilteredBlocks = useCallback((query: string) => {
    if (!query) return blockTypes
    const q = query.toLowerCase()
    return blockTypes.filter(
      (b) =>
        b.label.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.keywords.some((k) => k.includes(q))
    )
  }, [])

  // Handle image upload
  const handleImageUpload = useCallback(async (file: File) => {
    if (!editor) return

    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", "blog")

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        editor.chain().focus().setImage({ src: data.url }).run()
      }
    } catch (error) {
      console.error("Image upload failed:", error)
    }
  }, [editor])

  // Drag and drop
  useEffect(() => {
    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      const files = e.dataTransfer?.files
      if (files?.length) {
        const file = files[0]
        if (file.type.startsWith("image/")) handleImageUpload(file)
      }
    }
    const editorElement = document.querySelector(".editor-styles-wrapper")
    if (editorElement) {
      editorElement.addEventListener("drop", handleDrop as EventListener)
      editorElement.addEventListener("dragover", (e) => e.preventDefault())
    }
    return () => {
      if (editorElement) {
        editorElement.removeEventListener("drop", handleDrop as EventListener)
      }
    }
  }, [handleImageUpload])

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor)
    }
  }, [editor, onEditorReady])

  // Close slash menu on outside click
  useEffect(() => {
    const handleClick = () => {
      if (showSlashMenu) {
        setShowSlashMenu(false)
        slashStartPosRef.current = null
        setSlashQuery("")
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showSlashMenu])

  // Close table picker on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (showTablePicker && tableBtnRef && !tableBtnRef.contains(e.target as Node)) {
        const picker = document.getElementById("table-size-picker")
        if (picker && !picker.contains(e.target as Node)) {
          setShowTablePicker(false)
        }
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [showTablePicker, tableBtnRef])

  const insertBlock = useCallback((type: string, tableRows?: number, tableCols?: number) => {
    if (!editor) return

    // Delete the slash + any query text before inserting
    if (slashStartPosRef.current !== null) {
      const currentPos = editor.state.selection.$from.pos
      const deleteFrom = slashStartPosRef.current
      const deleteTo = currentPos
      if (deleteTo > deleteFrom) {
        editor.chain().deleteRange({ from: deleteFrom, to: deleteTo }).run()
      } else if (deleteTo === deleteFrom) {
        // just delete the "/" char
        editor.chain().deleteRange({ from: deleteFrom - 1, to: deleteFrom }).run()
      }
      slashStartPosRef.current = null
    }

    setShowSlashMenu(false)
    setSlashQuery("")

    switch (type) {
      case "heading1":
        editor.chain().focus().toggleHeading({ level: 1 }).run()
        break
      case "heading2":
        editor.chain().focus().toggleHeading({ level: 2 }).run()
        break
      case "heading3":
        editor.chain().focus().toggleHeading({ level: 3 }).run()
        break
      case "paragraph":
        editor.chain().focus().setParagraph().run()
        break
      case "bulletList":
        editor.chain().focus().toggleBulletList().run()
        break
      case "orderedList":
        editor.chain().focus().toggleOrderedList().run()
        break
      case "blockquote":
        editor.chain().focus().toggleBlockquote().run()
        break
      case "codeBlock":
        editor.chain().focus().toggleCodeBlock().run()
        break
      case "horizontalRule":
        editor.chain().focus().setHorizontalRule().run()
        break
      case "table":
        editor
          .chain()
          .focus()
          .insertTable({ rows: tableRows ?? 3, cols: tableCols ?? 3, withHeaderRow: true })
          .run()
        break
      case "image": {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/*"
        input.onchange = (e) => {
          const file = (e.target as HTMLInputElement).files?.[0]
          if (file) handleImageUpload(file)
        }
        input.click()
        break
      }
    }
  }, [editor, handleImageUpload])

  const filteredBlocks = getFilteredBlocks(slashQuery)

  if (!editor) return null

  return (
    <div className={cn("flex flex-col h-full", className)} ref={editorContainerRef}>
      {/* Top Toolbar - Sticky */}
      <div className="sticky top-0 z-40 bg-card border-b border-border px-2 py-1.5 flex items-center gap-1 flex-wrap shadow-sm">
        {/* History */}
        <div className="flex items-center border-r border-border pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        {/* Block Type Selector */}
        <div className="flex items-center border-r border-border pr-2 mr-2">
          <select
            value={
              editor.isActive("heading", { level: 1 }) ? "h1" :
                editor.isActive("heading", { level: 2 }) ? "h2" :
                  editor.isActive("heading", { level: 3 }) ? "h3" :
                    editor.isActive("heading", { level: 4 }) ? "h4" :
                      editor.isActive("heading", { level: 5 }) ? "h5" :
                        editor.isActive("heading", { level: 6 }) ? "h6" : "p"
            }
            onChange={(e) => {
              const value = e.target.value
              if (value === "p") {
                editor.chain().focus().setParagraph().run()
              } else {
                const level = parseInt(value.replace("h", "")) as 1 | 2 | 3 | 4 | 5 | 6
                editor.chain().focus().toggleHeading({ level }).run()
              }
            }}
            className="text-sm bg-transparent border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
            <option value="h4">Heading 4</option>
            <option value="h5">Heading 5</option>
            <option value="h6">Heading 6</option>
          </select>
        </div>

        {/* Text Formatting */}
        <div className="flex items-center border-r border-border pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("bold") && "bg-muted text-primary")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("italic") && "bg-muted text-primary")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("underline") && "bg-muted text-primary")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("strike") && "bg-muted text-primary")}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center border-r border-border pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive({ textAlign: "left" }) && "bg-muted text-primary")}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive({ textAlign: "center" }) && "bg-muted text-primary")}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive({ textAlign: "right" }) && "bg-muted text-primary")}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive({ textAlign: "justify" }) && "bg-muted text-primary")}
            title="Justify"
          >
            <AlignJustify className="h-4 w-4" />
          </button>
        </div>

        {/* Lists & Blocks */}
        <div className="flex items-center border-r border-border pr-2 mr-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("bulletList") && "bg-muted text-primary")}
            title="Bullet List (Ctrl+Alt+8)"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("orderedList") && "bg-muted text-primary")}
            title="Numbered List (Ctrl+Alt+7)"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("blockquote") && "bg-muted text-primary")}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("codeBlock") && "bg-muted text-primary")}
            title="Code Block"
          >
            <Code className="h-4 w-4" />
          </button>
        </div>

        {/* Insert */}
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => {
              const previousUrl = editor.getAttributes("link").href
              const url = window.prompt("Enter link URL:", previousUrl || "https://")
              if (url === null) return
              if (url === "") {
                editor.chain().focus().extendMarkRange("link").unsetLink().run()
                return
              }
              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
            }}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("link") && "bg-muted text-primary")}
            title="Insert Link (Ctrl+K)"
          >
            <LinkIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => insertBlock("image")}
            className="p-1.5 rounded hover:bg-muted"
            title="Insert Image"
          >
            <ImageIcon className="h-4 w-4" />
          </button>
          {/* Table button with size picker */}
          <div className="relative">
            <button
              type="button"
              ref={(el) => { if (el) setTableBtnRef(el) }}
              onClick={() => setShowTablePicker((v) => !v)}
              className={cn("p-1.5 rounded hover:bg-muted flex items-center gap-0.5", showTablePicker && "bg-muted text-primary")}
              title="Insert Table"
            >
              <TableIcon className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </button>
            {showTablePicker && (
              <div id="table-size-picker" className="absolute top-full left-0 mt-1 z-50">
                <TableSizePicker
                  onSelect={(rows, cols) => {
                    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
                  }}
                  onClose={() => setShowTablePicker(false)}
                />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-1.5 rounded hover:bg-muted"
            title="Insert Divider"
          >
            <SeparatorHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Heading Buttons */}
        <div className="flex items-center border-l border-border pl-2 ml-2">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("heading", { level: 1 }) && "bg-muted text-primary")}
            title="Heading 1 (Ctrl+Alt+1)"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("heading", { level: 2 }) && "bg-muted text-primary")}
            title="Heading 2 (Ctrl+Alt+2)"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("heading", { level: 3 }) && "bg-muted text-primary")}
            title="Heading 3 (Ctrl+Alt+3)"
          >
            <Heading3 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            className={cn("p-1.5 rounded hover:bg-muted", editor.isActive("heading", { level: 4 }) && "bg-muted text-primary")}
            title="Heading 4"
          >
            <Heading4 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="is-root-container is-desktop-preview is-layout-flow wp-block-post-content block-editor-block-list__layout max-w-4xl mx-auto py-8 px-6">

          <EditorContent editor={editor} />

          {/* Floating Toolbar */}
          {showFloatingToolbar && activeBlock && (
            <FloatingToolbar
              editor={editor}
              position={activeBlock.pos}
              blockType={activeBlock.type}
            />
          )}

          {/* Slash Menu */}
          {showSlashMenu && (
            <div
              className="absolute z-50 bg-card border border-border rounded-lg shadow-xl w-72 max-h-80 overflow-y-auto"
              style={{ top: slashMenuPos.top, left: slashMenuPos.left }}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <span className="text-xs font-medium text-muted-foreground">Insert block</span>
                {slashQuery && (
                  <span className="text-xs text-primary bg-primary/10 px-1.5 py-0.5 rounded font-mono">
                    /{slashQuery}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => { setShowSlashMenu(false); setSlashQuery("") }}
                  className="text-muted-foreground hover:text-foreground ml-auto"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              <div className="p-1">
                {filteredBlocks.length === 0 ? (
                  <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                    No blocks found for &ldquo;{slashQuery}&rdquo;
                  </div>
                ) : (
                  filteredBlocks.map((block, idx) => (
                    block.type === "table" ? (
                      // Table gets its own size picker inside slash menu
                      <div key={block.type} className="relative group">
                        <button
                          type="button"
                          onMouseDown={(e) => e.stopPropagation()}
                          className={cn(
                            "w-full flex items-center gap-3 px-2 py-2 rounded transition-colors text-left",
                            idx === slashMenuSelected ? "bg-muted" : "hover:bg-muted/60"
                          )}
                          onMouseEnter={() => setSlashMenuSelected(idx)}
                        >
                          <div className="w-9 h-9 rounded bg-muted flex items-center justify-center shrink-0">
                            <block.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{block.label}</div>
                            <div className="text-xs text-muted-foreground">{block.description}</div>
                          </div>
                          <ChevronDown className="h-3 w-3 ml-auto text-muted-foreground rotate-[-90deg]" />
                        </button>
                        {/* Inline table size picker for slash menu */}
                        {idx === slashMenuSelected && (
                          <div className="mx-2 mb-1 p-2 bg-muted/40 rounded-md">
                            <TableSizePicker
                              onSelect={(rows, cols) => insertBlock("table", rows, cols)}
                              onClose={() => { setShowSlashMenu(false); setSlashQuery("") }}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        key={block.type}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          insertBlock(block.type)
                        }}
                        onMouseEnter={() => setSlashMenuSelected(idx)}
                        className={cn(
                          "w-full flex items-center gap-3 px-2 py-2 rounded transition-colors text-left",
                          idx === slashMenuSelected ? "bg-muted" : "hover:bg-muted/60"
                        )}
                      >
                        <div className="w-9 h-9 rounded bg-muted flex items-center justify-center shrink-0">
                          <block.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{block.label}</div>
                          <div className="text-xs text-muted-foreground">{block.description}</div>
                        </div>
                      </button>
                    )
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
