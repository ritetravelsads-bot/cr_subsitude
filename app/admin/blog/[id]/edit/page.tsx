import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { getBlogPostById } from "@/app/blogs/_actions"
import WordPressBlogEditor from "@/components/admin/wordpress-blog-editor"

export const metadata: Metadata = {
  title: "Edit Blog Post | CountryRoof Admin",
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  try {
    await requireAdmin()
  } catch {
    redirect("/auth/login")
  }

  const { id } = await params
  const blogPost = await getBlogPostById(id)

  if (!blogPost) {
    redirect("/admin/blog")
  }

  return <WordPressBlogEditor initialData={blogPost} />
}
