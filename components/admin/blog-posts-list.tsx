"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2, Plus, FileText, RefreshCw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface BlogPost {
  _id: string
  title: string
  slug: string
  category: string
  author: string
  createdAt: string
  published: boolean
  is_published: boolean
  cover_image?: string
  banner_image?: string
  excerpt?: string
}

export default function BlogPostsList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/blog/posts", {
        cache: "no-store",
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }
      
      const data = await response.json()
      const fetchedPosts = data.posts || []
      setPosts(fetchedPosts)
      setFilteredPosts(fetchedPosts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      setFilteredPosts(
        posts.filter(
          (post) =>
            post.title.toLowerCase().includes(query) ||
            post.author.toLowerCase().includes(query) ||
            post.category?.toLowerCase().includes(query)
        )
      )
    } else {
      setFilteredPosts(posts)
    }
  }, [searchQuery, posts])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) return
    
    setDeleting(id)
    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, {
        method: "DELETE",
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete blog post")
      }
      
      // Remove from both states
      setPosts((prev) => prev.filter((post) => post._id !== id))
      setFilteredPosts((prev) => prev.filter((post) => post._id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete blog post")
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading posts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={fetchPosts}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredPosts.length} of {posts.length} post{posts.length !== 1 ? "s" : ""}
          </span>
          <Button variant="outline" size="sm" onClick={fetchPosts}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button asChild size="sm">
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      {posts.length === 0 ? (
        <div className="py-12 text-center space-y-4 border border-dashed border-border rounded-lg">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <div className="space-y-1">
            <p className="text-sm font-medium">No blog posts yet</p>
            <p className="text-xs text-muted-foreground">Create your first blog post to get started</p>
          </div>
          <Button asChild size="sm">
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Link>
          </Button>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No posts match your search
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => {
                  const thumbnail = post.cover_image || post.banner_image
                  const isPublished = post.published || post.is_published
                  return (
                    <TableRow key={post._id}>
                      <TableCell>
                        <div className="w-12 h-12 relative rounded overflow-hidden bg-muted flex-shrink-0">
                          {thumbnail ? (
                            <Image
                              src={thumbnail}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="h-5 w-5 text-muted-foreground/50" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                          {post.excerpt && (
                            <p className="text-xs text-muted-foreground line-clamp-1 hidden sm:block">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {post.author}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className="text-xs px-2 py-0.5 bg-muted rounded capitalize">
                          {post.category || "general"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            isPublished
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {isPublished ? "Published" : "Draft"}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={isPublished ? `/blogs/${post.slug}` : `/blogs/preview/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/blog/${post._id}/edit`}
                            className="p-2 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(post._id)}
                            disabled={deleting === post._id}
                            className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {deleting === post._id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
