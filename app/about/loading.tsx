export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-64 bg-muted animate-pulse" />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="h-8 bg-muted rounded w-1/3 mb-4 animate-pulse" />
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-full animate-pulse" />
          <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
          <div className="h-4 bg-muted rounded w-4/6 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
