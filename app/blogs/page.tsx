import type { Metadata } from "next"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import Link from "next/link"
import Image from "next/image"
import { Search, Clock, User, ChevronRight, ArrowRight, TrendingUp, Calendar } from "lucide-react"
import { connectToDatabase } from "@/lib/mongodb"

export const metadata: Metadata = {
  title: "Blogs | CountryRoof - Real Estate Insights & Property Tips",
  description:
    "Explore expert insights on real estate investments, property buying guides, market trends, and luxury living tips from CountryRoof professionals.",
  alternates: {
    canonical: "https://countryroof.in/blogs",
  },
  openGraph: {
    title: "Blogs | CountryRoof - Real Estate Insights",
    description: "Expert real estate insights and property investment tips from CountryRoof professionals.",
    url: "https://countryroof.in/blogs",
  },
}

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  author: string
  category: string
  readTime: number
  read_time?: number
  createdAt: string
  cover_image?: string
  banner_image?: string
  tags?: string[]
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const { db } = await connectToDatabase()
    const posts = await db
      .collection("blog_posts")
      .find({ $or: [{ is_published: true }, { published: true }] })
      .sort({ createdAt: -1 })
      .toArray()

    return posts.map((post) => ({
      _id: post._id.toString(),
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      author: post.author || "CountryRoof",
      category: post.category || "Uncategorized",
      readTime: post.readTime || post.read_time || 5,
      createdAt: post.createdAt?.toISOString() || new Date().toISOString(),
      cover_image: post.cover_image,
      banner_image: post.banner_image,
      tags: post.tags || [],
    }))
  } catch (error) {
    console.error("Failed to fetch blog posts:", error)
    return []
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const { db } = await connectToDatabase()
    const categories = await db.collection("blog_posts").distinct("category")
    return categories.filter(Boolean)
  } catch {
    return []
  }
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const params = await searchParams
  const allPosts = await getBlogPosts()
  const categories = await getCategories()

  // Filter posts based on search params
  let filteredPosts = allPosts
  if (params.category) {
    filteredPosts = filteredPosts.filter(
      (post) => post.category.toLowerCase() === params.category?.toLowerCase()
    )
  }
  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm)
    )
  }

  // Get featured post (first post) and rest
  const featuredPost = filteredPosts[0]
  const recentPosts = filteredPosts.slice(1, 4)
  const remainingPosts = filteredPosts.slice(4)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* SEO H1 - Screen reader accessible */}
        <h1 className="sr-only">Real Estate Blogs - Property Tips &amp; Market Insights | CountryRoof</h1>

        {/* Category Filter */}
        <section className="w-full py-6 px-4 bg-white border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <Link
                href="/blogs"
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${!params.category
                    ? "bg-[#002366] text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                All Posts
              </Link>
              {categories.map((category) => (
                <span
                  key={category}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium capitalize ${params.category?.toLowerCase() === category.toLowerCase()
                      ? "bg-[#002366] text-white shadow-lg shadow-blue-500/25"
                      : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </section>

        {filteredPosts.length === 0 ? (
          <section className="w-full py-24 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">No articles found</h2>
              <p className="text-gray-600 mb-6">
                {params.search
                  ? `No results for "${params.search}". Try different keywords.`
                  : "No blog posts in this category yet. Check back soon!"}
              </p>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#002366] text-white rounded-lg hover:bg-[#001a4d] transition-colors"
              >
                View All Posts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        ) : (
          <>
            {/* Featured Post */}
            {featuredPost && (
              <section className="w-full py-12 md:py-16 px-4">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Article</h2>
                    <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Latest
                    </div>
                  </div>

                  <Link href={`/blogs/${featuredPost.slug}`} className="group block">
                    <div className="relative grid md:grid-cols-2 gap-8 bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-gray-300/50 transition-all duration-500">
                      {/* Image */}
                      <div className="relative h-64 md:h-[420px] overflow-hidden">
                        {featuredPost.cover_image || featuredPost.banner_image ? (
                          <Image
                            src={featuredPost.cover_image || featuredPost.banner_image || ""}
                            alt={featuredPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#002366] to-[#003d99] flex items-center justify-center">
                            <span className="text-6xl text-white/20 font-bold">CR</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <span className="px-4 py-2 bg-red-500 text-white text-xs font-semibold rounded-full uppercase tracking-wide">
                            Featured
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col justify-center p-6 md:p-10">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="px-3 py-1 bg-[#002366]/10 text-[#002366] text-xs font-semibold rounded-full capitalize">
                            {featuredPost.category || "Uncategorized"}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {featuredPost.readTime} min read
                          </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#002366] transition-colors leading-tight">
                          {featuredPost.title}
                        </h3>

                        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                          {featuredPost.excerpt}
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#002366] rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{featuredPost.author}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(featuredPost.createdAt).toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </div>
                            </div>
                          </div>

                          <span className="flex items-center gap-2 text-[#002366] font-semibold group-hover:gap-3 transition-all">
                            Read More
                            <ArrowRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </section>
            )}

            {/* Recent Posts */}
            {recentPosts.length > 0 && (
              <section className="w-full py-12 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Recent Articles</h2>

                  <div className="grid md:grid-cols-3 gap-6">
                    {recentPosts.map((post) => (
                      <Link key={post._id} href={`/blogs/${post.slug}`} className="group">
                        <article className="bg-white rounded-2xl overflow-hidden border border-gray-100 h-full hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 transition-all duration-300">
                          {/* Image */}
                          <div className="relative h-48 overflow-hidden">
                            {post.cover_image || post.banner_image ? (
                              <Image
                                src={post.cover_image || post.banner_image || ""}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, 33vw"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-[#002366] to-[#003d99] flex items-center justify-center">
                                <span className="text-4xl text-white/20 font-bold">CR</span>
                              </div>
                            )}
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#002366] text-xs font-semibold rounded-full capitalize">
                                {post.category || "Uncategorized"}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-5">
                            <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#002366] transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{post.excerpt}</p>

                            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {post.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.readTime} min
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* All Posts Grid */}
            {remainingPosts.length > 0 && (
              <section className="w-full py-12 md:py-16 px-4">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">More Articles</h2>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {remainingPosts.map((post) => (
                      <Link key={post._id} href={`/blogs/${post.slug}`} className="group">
                        <article className="bg-white rounded-xl overflow-hidden border border-gray-100 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                          <div className="relative h-36 overflow-hidden">
                            {post.cover_image || post.banner_image ? (
                              <Image
                                src={post.cover_image || post.banner_image || ""}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 768px) 100vw, 25vw"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-2xl text-gray-300 font-bold">CR</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <span className="text-xs text-[#002366] font-medium capitalize">
                              {post.category || "Uncategorized"}
                            </span>
                            <h3 className="font-semibold text-sm text-gray-900 mt-1 line-clamp-2 group-hover:text-[#002366] transition-colors">
                              {post.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                              <Clock className="h-3 w-3" />
                              {post.readTime} min read
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* Newsletter CTA */}
        <section className="w-full py-16 md:py-24 px-4 bg-[#002366]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated with Real Estate Insights
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Get the latest articles on property investments, market trends, and expert tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-5 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-white/40"
              />
              <button className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
