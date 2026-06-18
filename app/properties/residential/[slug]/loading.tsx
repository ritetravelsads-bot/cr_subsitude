export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section skeleton */}
      <div className="bg-gradient-to-b from-primary/5 to-background px-4 py-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="h-7 bg-muted rounded w-48 mb-2 animate-pulse" />
          <div className="h-4 bg-muted rounded w-32 animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters skeleton */}
        <div className="bg-card border border-border rounded-xl mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 h-10 bg-muted rounded-lg animate-pulse" />
            <div className="flex gap-2">
              <div className="w-28 h-10 bg-muted rounded-lg animate-pulse" />
              <div className="w-28 h-10 bg-muted rounded-lg animate-pulse" />
              <div className="w-28 h-10 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Properties grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="h-44 bg-muted animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                <div className="flex gap-2">
                  <div className="h-5 bg-muted rounded w-12 animate-pulse" />
                  <div className="h-5 bg-muted rounded w-16 animate-pulse" />
                </div>
                <div className="pt-2 border-t border-border">
                  <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
