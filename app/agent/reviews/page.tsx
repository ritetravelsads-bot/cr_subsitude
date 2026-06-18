"use client"

import { Star, MessageSquare } from "lucide-react"
import { useEffect, useState } from "react"

export default function AgentReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetch("/api/agent/reviews")
        const data = await res.json()
        setReviews(data)
      } catch (error) {
        console.error("[v0] Error loading reviews:", error)
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [])

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "0.0"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reviews & Ratings</h1>
        <p className="text-sm text-muted-foreground mt-1">See what buyers think about your properties</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Average Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-foreground">{avgRating}</p>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={12}
                      className={i < Math.round(Number(avgRating)) ? "fill-yellow-500 text-yellow-500" : "text-muted"}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Reviews</p>
              <p className="text-xl font-bold text-foreground">{reviews.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Star className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Properties Reviewed</p>
              <p className="text-xl font-bold text-foreground">{new Set(reviews.map((r) => r.property)).size}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <Star className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No reviews yet</p>
          <p className="text-xs text-muted-foreground mt-1">Reviews will appear here once buyers rate your properties</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review._id} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">{review.rating}/5 Stars</span>
              </div>
              <p className="text-sm text-foreground">{review.comment}</p>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">Property: {review.property}</p>
                {review.created_at && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
