export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-48 bg-muted animate-pulse" />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
            <div className="h-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-1/2 animate-pulse" />
            <div className="h-48 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
