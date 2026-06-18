"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  author: string
  category: string
  readTime: number
  createdAt: string
  cover_image?: string
  banner_image?: string
}

export default function BlogGrid() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/blog/posts")
        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts || [])
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading blog posts...</div>
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted-foreground">No blog posts yet. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {posts.map((post) => {
        const thumbnail = post.cover_image || post.banner_image
        return (
          <Link key={post._id} href={`/blogs/${post.slug}`}>
            <Card className="border border-border hover:border-primary/50 transition-colors h-full cursor-pointer overflow-hidden">
              {thumbnail && (
                <div className="relative w-full h-40">
                  <Image
                    src={thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-base line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="text-xs">{post.author}</CardDescription>
                  </div>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded whitespace-nowrap capitalize">
                    {post.category || "general"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{post.excerpt}</p>
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</span>
                  <span className="text-xs text-muted-foreground">{post.readTime} min read</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
