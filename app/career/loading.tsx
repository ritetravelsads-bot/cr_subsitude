export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-64 bg-muted animate-pulse" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 bg-muted rounded w-1/3 mb-6 animate-pulse" />
        <div className="grid gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="space-y-2 flex-1">
                  <div className="h-5 bg-muted rounded w-1/3 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
                </div>
                <div className="h-8 bg-muted rounded w-24 animate-pulse" />
              </div>
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
