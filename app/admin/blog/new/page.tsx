import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import WordPressBlogEditor from "@/components/admin/wordpress-blog-editor"

export const metadata: Metadata = {
  title: "Create Blog Post | CountryRoof Admin",
}

export default async function NewBlogPostPage() {
  try {
    await requireAdmin()
  } catch {
    redirect("/auth/login")
  }

  return <WordPressBlogEditor />
}
