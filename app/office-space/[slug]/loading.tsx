export default function OfficeSpaceDetailLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Breadcrumb skeleton */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Image skeleton */}
          <div className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />

          {/* Info skeleton */}
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
              <div className="h-6 w-24 bg-muted rounded-full animate-pulse" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
            <div className="h-24 bg-muted/50 rounded-xl animate-pulse" />
            <div className="h-14 bg-emerald-100 rounded-xl animate-pulse" />
            <div className="h-14 bg-green-100 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
          <div className="h-4 w-4/6 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </main>
  )
}
