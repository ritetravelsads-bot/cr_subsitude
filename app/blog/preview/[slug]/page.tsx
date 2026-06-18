// Import necessary modules and components
import { notFound, redirect } from "next/navigation"
import { getBlogPostBySlug } from "@/app/blog/_actions"
import { BlogPostPreview } from "@/app/blog/_components"
import { requireAdmin } from "@/lib/auth"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

// Define the default export function
export default async function BlogPostPreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  // Check if user is admin using the proper auth function
  try {
    await requireAdmin()
  } catch {
    redirect("/auth/login")
  }

  const { slug } = await params
  // Fetch blog post including unpublished drafts for preview
  const blogPost = await getBlogPostBySlug(slug, true)

  if (!blogPost) {
    notFound()
  }

  // Render the blog post preview component with preview banner
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <div className="bg-amber-100 border-b border-amber-200 px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="text-sm text-amber-800 font-medium">
              Preview Mode - This post is not published yet
            </span>
            <a
              href={`/admin/blog/${blogPost._id}/edit`}
              className="text-sm text-amber-800 hover:text-amber-900 underline"
            >
              Edit Post
            </a>
          </div>
        </div>
        <BlogPostPreview blogPost={blogPost} />
      </main>
    </>
  )
}
