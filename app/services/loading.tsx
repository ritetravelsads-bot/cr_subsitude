export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-48 bg-muted animate-pulse" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 bg-muted rounded w-1/3 mb-2 animate-pulse mx-auto" />
        <div className="h-4 bg-muted rounded w-1/2 mb-8 animate-pulse mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-muted rounded-lg mb-4 animate-pulse" />
              <div className="h-5 bg-muted rounded w-2/3 mb-3 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded w-full animate-pulse" />
                <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
