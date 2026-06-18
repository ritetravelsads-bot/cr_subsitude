export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero image skeleton */}
      <div className="h-64 md:h-96 bg-muted animate-pulse" />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-muted rounded w-3/4 mb-3 animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-4 bg-muted rounded w-24 animate-pulse" />
            <div className="h-4 bg-muted rounded w-32 animate-pulse" />
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded w-full animate-pulse" />
          <div className="h-4 bg-muted rounded w-full animate-pulse" />
          <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-muted rounded w-full animate-pulse" />
          <div className="h-4 bg-muted rounded w-4/6 animate-pulse" />
          <div className="h-32 bg-muted rounded animate-pulse" />
          <div className="h-4 bg-muted rounded w-full animate-pulse" />
          <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
