import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Known property type slugs - these are valid type segments
const VALID_TYPE_SLUGS = ['residential', 'commercial', 'plots']

// Known category/filter paths that should NOT be redirected
const VALID_PATHS = [
  'category',
  'location', 
  'types',
  'residential',
  'commercial',
  'plots',
  'preview',
  'reviews'
]

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  
  // Redirect /blog to /blogs (301 permanent redirect)
  if (pathname === '/blog' || pathname.startsWith('/blog/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace('/blog', '/blogs')
    url.search = '' // Remove query params for clean URLs
    return NextResponse.redirect(url, 301)
  }
  
  // Only handle /properties/* routes
  if (!pathname.startsWith('/properties/')) {
    return NextResponse.next()
  }

  // Extract the path after /properties/
  const pathAfterProperties = pathname.replace('/properties/', '')
  const segments = pathAfterProperties.split('/').filter(Boolean)
  
  // Strip query parameters from property detail pages (e.g., ?utm_source=luma)
  // Property detail pages are: /properties/{type}/{slug} (2 segments where first is a valid type)
  if (segments.length === 2 && VALID_TYPE_SLUGS.includes(segments[0]) && search) {
    const url = request.nextUrl.clone()
    url.search = '' // Remove all query parameters
    return NextResponse.redirect(url, 301)
  }
  
  // Skip if empty or has more than 2 segments (already correct format or other route)
  if (segments.length === 0 || segments.length > 2) {
    return NextResponse.next()
  }

  const firstSegment = segments[0]
  
  // If we have 2 segments and first is a valid type, it's the new format - let it through
  if (segments.length === 2 && VALID_TYPE_SLUGS.includes(firstSegment)) {
    return NextResponse.next()
  }
  
  // If first segment is a valid path (category, location, types, or a property type), let it through
  if (VALID_PATHS.includes(firstSegment)) {
    return NextResponse.next()
  }

  // If we have exactly one segment and it's not a valid path, 
  // it's likely an old URL format like /properties/elan-presidential
  // We need to look up the actual property type and redirect accordingly
  if (segments.length === 1 && firstSegment) {
    try {
      // Call API to get the actual property type
      const baseUrl = request.nextUrl.origin
      const response = await fetch(`${baseUrl}/api/properties/type-lookup/${encodeURIComponent(firstSegment)}`)
      const data = await response.json()
      const typeSlug = data.typeSlug || 'residential'
      
      const url = request.nextUrl.clone()
      url.pathname = `/properties/${typeSlug}/${firstSegment}`
      return NextResponse.redirect(url, 301)
    } catch (error) {
      // Fallback to residential if API call fails
      const url = request.nextUrl.clone()
      url.pathname = `/properties/residential/${firstSegment}`
      return NextResponse.redirect(url, 301)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/properties/:path*', '/blog', '/blog/:path*'],
}
