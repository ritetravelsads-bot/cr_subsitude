"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, MapPin, ArrowRight, BadgeCheck, ExternalLink } from "lucide-react"
import { formatPriceToIndian, getPropertyUrl, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface Project {
  _id: string
  property_name: string
  slug: string
  main_thumbnail?: string
  city?: string
  state?: string
  lowest_price?: number
  max_price?: number
  property_type?: string
  possession?: string
}

interface Developer {
  _id: string
  name: string
  slug: string
  logo_url?: string
  description?: string
  website?: string
  project_count?: number
}

interface DeveloperProjectsProps {
  developerId?: string
  developerSlug?: string
  developerName?: string
  excludePropertyId?: string
}

export function DeveloperProjects({ 
  developerId, 
  developerSlug, 
  developerName,
  excludePropertyId 
}: DeveloperProjectsProps) {
  const [developer, setDeveloper] = useState<Developer | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDeveloperProjects = async () => {
      // Priority: developerSlug > derive from developerName > developerId
      let slug = developerSlug
      
      // If no slug but we have a name, create slug from name (preferred over raw developerId)
      if (!slug && developerName) {
        slug = developerName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      }
      
      // Fall back to developerId only if it looks like a valid slug (not an ObjectId or placeholder)
      if (!slug && developerId) {
        // Only use developerId if it doesn't look like an ObjectId (24 hex chars) or a placeholder
        const isObjectId = /^[a-f0-9]{24}$/i.test(developerId)
        const isPlaceholder = developerId.includes("_id") || developerId.includes("placeholder")
        if (!isObjectId && !isPlaceholder) {
          slug = developerId
        }
      }
      
      if (!slug) {
        setLoading(false)
        return
      }

      try {
        const excludeParam = excludePropertyId ? `&exclude=${excludePropertyId}` : ""
        const res = await fetch(`/api/developers/${encodeURIComponent(slug)}/projects?limit=4${excludeParam}`)
        
        if (res.ok) {
          const data = await res.json()
          setDeveloper(data.developer)
          setProjects(data.projects || [])
        } else {
          // If API fails but we have developerName, still show the section header
          if (developerName) {
            setDeveloper({
              _id: slug,
              name: developerName,
              slug: slug,
            } as Developer)
          }
        }
      } catch (error) {
        console.error("Error loading developer projects:", error)
        // If error but we have developerName, still show the section header
        if (developerName) {
          setDeveloper({
            _id: slug,
            name: developerName,
            slug: slug,
          } as Developer)
        }
      } finally {
        setLoading(false)
      }
    }

    loadDeveloperProjects()
  }, [developerId, developerSlug, developerName, excludePropertyId])

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-10 bg-muted rounded-xl w-72 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-muted rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (!developer && !developerName) return null

  const displayName = developer?.name || developerName

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Developer Header */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-10 p-6 bg-gradient-to-br from-card to-muted/50 border border-border rounded-3xl">
          <div className="flex items-center gap-5">
            {developer?.logo_url ? (
              <img
                src={developer.logo_url}
                alt={displayName}
                className="w-20 h-20 rounded-2xl object-contain bg-white border border-border p-2 shadow-sm"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Building2 className="h-10 w-10 text-primary" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{displayName}</h2>
                <BadgeCheck className="h-6 w-6 text-primary" />
              </div>
              {developer?.project_count && (
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{developer.project_count}</span> Projects Delivered
                </p>
              )}
            </div>
          </div>

          <div className="lg:ml-auto flex flex-wrap gap-3">
            {developer?.website && (
              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <a href={developer.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              </Button>
            )}
            {developer?.slug && (
              <Button asChild size="lg" className="rounded-xl">
                <Link href={`/developers/${developer.slug}`}>
                  View All Projects
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Developer Description */}
        {developer?.description && (
          <p className="text-[15px] text-muted-foreground mb-10 leading-relaxed max-w-4xl">
            {developer.description}
          </p>
        )}

        {/* Projects Grid */}
        {projects.length > 0 && (
          <>
            <h3 className="text-xl font-bold text-foreground mb-6">
              More Projects by {displayName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {projects.map(project => (
                <Link
                  key={project._id}
                  href={getPropertyUrl({ _id: project._id, slug: project.slug, property_type: project.property_type })}
                  className={cn(
                    "group bg-card border border-border rounded-2xl overflow-hidden",
                    "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300",
                    "hover:-translate-y-1"
                  )}
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    {project.main_thumbnail ? (
                      <img
                        src={project.main_thumbnail}
                        alt={project.property_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-5">
                    <h4 className="font-bold text-foreground text-[15px] mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {project.property_name}
                    </h4>

                    {(project.city || project.state) && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-3">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{[project.city, project.state].filter(Boolean).join(", ")}</span>
                      </p>
                    )}

                    {project.lowest_price && (
                      <p className="text-lg font-bold text-primary">
                        {formatPriceToIndian(project.lowest_price)}
                        {project.max_price && project.max_price !== project.lowest_price && (
                          <span className="text-xs text-muted-foreground font-normal ml-1">
                            onwards
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
