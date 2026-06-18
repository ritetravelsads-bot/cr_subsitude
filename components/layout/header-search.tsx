"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search, X, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

interface SearchResult {
  property_name: string
  slug: string
  address: string
  neighborhood: string
}

export default function HeaderSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchResults = useCallback(async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setResults([])
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/properties?search=${encodeURIComponent(searchTerm)}&limit=5`)
      const data = await res.json()
      setResults(data.properties || [])
    } catch {
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchResults(query)
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, fetchResults])

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
        setTimeout(() => inputRef.current?.focus(), 100)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
        setQuery("")
        setResults([])
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/properties?search=${encodeURIComponent(query)}`)
      setIsOpen(false)
      setQuery("")
      setResults([])
    }
  }

  const handleResultClick = (slug: string) => {
    router.push(`/properties/${slug}`)
    setIsOpen(false)
    setQuery("")
    setResults([])
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Search Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true)
            setTimeout(() => inputRef.current?.focus(), 100)
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all text-sm text-gray-500"
          aria-label="Search properties"
        >
          <Search className="h-4 w-4" />
          <span className="hidden xl:inline">Search properties...</span>
          <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-gray-400 bg-gray-200 rounded">
            <span className="text-xs">{"⌘"}</span>K
          </kbd>
        </button>
      )}

      {/* Expanded Search Input */}
      {isOpen && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50 w-[340px] xl:w-[400px]">
          <div className="flex items-center gap-2 bg-background border-2 border-primary rounded-xl shadow-lg px-3 py-2 animate-in fade-in zoom-in-95 duration-200">
            <Search className="h-4 w-4 text-primary shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search properties, locations..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch()
              }}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground/60 text-foreground"
            />

            <button
              onClick={() => {
                setIsOpen(false)
                setQuery("")
                setResults([])
              }}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Results Dropdown */}
          {(results.length > 0 || isLoading) && (
            <div className="mt-2 bg-background border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {isLoading && (
                <div className="px-4 py-3 text-sm text-muted-foreground">Searching...</div>
              )}
              {!isLoading && results.length > 0 && (
                <div className="p-2">
                  <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Properties
                  </p>
                  {results.map((result) => (
                    <button
                      key={result.slug}
                      onClick={() => handleResultClick(result.slug)}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted transition-colors flex items-center gap-3 group"
                    >
                      <div className="p-1.5 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                        <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {result.property_name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {result.neighborhood || result.address}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </button>
                  ))}
                  <button
                    onClick={handleSearch}
                    className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm font-medium text-primary"
                  >
                    View all results for &quot;{query}&quot;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
