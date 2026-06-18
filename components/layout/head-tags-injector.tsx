"use client"

import { useEffect } from "react"

export default function HeadTagsInjector() {
  useEffect(() => {
    // Find the JSON data element
    const dataElement = document.querySelector('script[data-head-tags="true"]')
    if (!dataElement) return

    try {
      const isEncoded = dataElement.getAttribute("data-encoded") === "true"
      const rawContent = dataElement.textContent || "{}"
      const jsonString = isEncoded ? atob(rawContent) : rawContent
      const data = JSON.parse(jsonString)
      if (!data.tags) return

      // Create a temporary container to parse the HTML
      const temp = document.createElement("div")
      temp.innerHTML = data.tags

      // Move all child elements to the head
      const children = Array.from(temp.children)
      children.forEach((child) => {
        // Check if a similar tag already exists to avoid duplicates
        const tagName = child.tagName.toLowerCase()
        
        if (tagName === "meta") {
          const name = child.getAttribute("name")
          const property = child.getAttribute("property")
          
          // Skip if this meta tag already exists
          if (name) {
            const existing = document.head.querySelector(`meta[name="${name}"]`)
            if (existing) return
          }
          if (property) {
            const existing = document.head.querySelector(`meta[property="${property}"]`)
            if (existing) return
          }
        }
        
        if (tagName === "script") {
          const src = child.getAttribute("src")
          if (src) {
            // Skip broken/invalid script URLs to avoid 404 errors
            // Filter out known problematic patterns
            if (
              src.includes("insights/script") ||
              src.includes("undefined") ||
              src.includes("null") ||
              !src.startsWith("http") && !src.startsWith("/") && !src.startsWith("//")
            ) {
              return
            }
            // Skip if script with same src already exists
            const existing = document.head.querySelector(`script[src="${src}"]`)
            if (existing) return
          }
        }
        
        // Clone and append to head
        document.head.appendChild(child.cloneNode(true))
      })
    } catch (error) {
      console.error("Error injecting head tags:", error)
    }
  }, [])

  return null
}
