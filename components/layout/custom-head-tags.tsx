import { connectDB } from "@/lib/mongodb"

interface HeadTag {
  _id: string
  tag_content: string
  tag_type: string
}

async function getActiveHeadTags(): Promise<HeadTag[]> {
  try {
    const db = await connectDB()
    
    const tags = await db
      .collection("head_tags")
      .find({ is_active: true })
      .sort({ created_at: 1 })
      .toArray()
    
    return tags.map(tag => ({
      _id: tag._id.toString(),
      tag_content: tag.tag_content,
      tag_type: tag.tag_type,
    }))
  } catch (error) {
    console.error("Error fetching head tags:", error)
    return []
  }
}

// Function to check if a tag contains robots noindex/nofollow that should be blocked
function shouldBlockTag(tagContent: string): boolean {
  const lower = tagContent.toLowerCase()
  
  // Block any meta tag with robots name attribute that contains noindex or nofollow
  if (lower.includes('name="robots"') || lower.includes("name='robots'")) {
    if (lower.includes('noindex') || lower.includes('nofollow')) {
      console.log("[v0] Blocking robots meta tag:", tagContent)
      return true
    }
  }
  
  // Also block meta robots tags with property attribute (edge case)
  if (lower.includes('property="robots"') || lower.includes("property='robots'")) {
    if (lower.includes('noindex') || lower.includes('nofollow')) {
      console.log("[v0] Blocking robots meta property tag:", tagContent)
      return true
    }
  }
  
  return false
}

export default async function CustomHeadTags() {
  const tags = await getActiveHeadTags()
  
  console.log("[v0] CustomHeadTags - Fetched", tags.length, "active tags from database")
  
  // Filter out any robots meta tags that contain noindex or nofollow
  const filteredTags = tags.filter((tag) => !shouldBlockTag(tag.tag_content))
  
  console.log("[v0] CustomHeadTags - After filtering:", filteredTags.length, "tags will be rendered")
  
  if (filteredTags.length === 0) {
    console.log("[v0] CustomHeadTags - No tags to render, returning null")
    return null
  }
  
  // Use Fragment with suppressHydrationWarning to handle dynamic content
  // We inject raw HTML as a script that creates the elements on client-side only
  // This avoids hydration mismatches from dynamic database content
  const combinedHtml = filteredTags.map(tag => tag.tag_content).join('\n')
  // Encode as base64 to prevent any JSON characters from leaking as visible text
  const encoded = Buffer.from(JSON.stringify({ tags: combinedHtml })).toString('base64')
  
  return (
    <script
      id="custom-head-tags"
      type="application/json"
      data-head-tags="true"
      data-encoded="true"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: encoded }}
    />
  )
}
