"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function getBlogPostById(id: string) {
  try {
    const { db } = await connectToDatabase()
    const post = await db.collection("blog_posts").findOne({ _id: new ObjectId(id) })
    
    if (!post) return null
    
    return {
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      author: post.author || "CountryRoof",
      category: post.category,
      readTime: post.readTime?.toString() || post.read_time?.toString() || "5",
      cover_image: post.cover_image || "",
      banner_image: post.banner_image || "",
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || "",
      meta_keywords: post.meta_keywords || "",
      og_title: post.og_title || "",
      og_description: post.og_description || "",
      og_image: post.og_image || "",
      tags: post.tags || [],
      is_published: post.is_published || post.published || false,
      faqs: post.faqs || [],
      canonical_url: post.canonical_url || "",
    }
  } catch (error) {
    console.error("Failed to fetch blog post:", error)
    return null
  }
}

export async function getBlogPostBySlug(slug: string) {
  try {
    const { db } = await connectToDatabase()
    const post = await db.collection("blog_posts").findOne({ slug })
    
    if (!post) return null
    
    return {
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      author: post.author || "CountryRoof",
      category: post.category,
      readTime: post.readTime || post.read_time || 5,
      createdAt: post.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: post.updatedAt?.toISOString() || post.createdAt?.toISOString() || new Date().toISOString(),
      cover_image: post.cover_image || "",
      banner_image: post.banner_image || "",
      meta_title: post.meta_title || "",
      meta_description: post.meta_description || "",
      meta_keywords: post.meta_keywords || "",
      og_title: post.og_title || "",
      og_description: post.og_description || "",
      og_image: post.og_image || "",
      tags: post.tags || [],
      is_published: post.is_published || post.published || false,
      faqs: post.faqs || [],
      schema_markup: post.schema_markup,
      canonical_url: post.canonical_url || "",
    }
  } catch (error) {
    console.error("Failed to fetch blog post by slug:", error)
    return null
  }
}
