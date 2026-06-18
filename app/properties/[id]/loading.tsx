export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <div className="h-[50vh] bg-muted animate-pulse" />
      
      {/* Sticky bar skeleton */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
            <div className="hidden sm:block space-y-1">
              <div className="h-4 bg-muted rounded w-32 animate-pulse" />
              <div className="h-3 bg-muted rounded w-24 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
            <div className="w-8 h-8 bg-muted rounded-lg animate-pulse" />
            <div className="w-24 h-8 bg-muted rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* About section skeleton */}
          <div>
            <div className="h-6 bg-muted rounded w-48 mb-4 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
              <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-muted rounded w-4/6 animate-pulse" />
            </div>
          </div>
          
          {/* Specs grid skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-3">
                <div className="w-4 h-4 bg-muted rounded mb-2 animate-pulse" />
                <div className="h-2 bg-muted rounded w-16 mb-1 animate-pulse" />
                <div className="h-3 bg-muted rounded w-20 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
