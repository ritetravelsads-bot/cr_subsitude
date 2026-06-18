'use client'

import { Building2, ArrowRight, Star } from 'lucide-react'
import type { FeaturedProject } from '@/data/location-content'

interface FeaturedProjectsSectionProps {
  projects: FeaturedProject[]
  locationName: string
}

export default function FeaturedProjectsSection({ projects, locationName }: FeaturedProjectsSectionProps) {
  return (
    <section className="py-16 bg-[var(--luxury-cream)]">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-[var(--luxury-gold)] text-sm uppercase tracking-widest font-medium">
            Featured Collections
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--luxury-navy)] mt-2 mb-4">
            Signature Properties in {locationName}
          </h2>
          <p className="text-[var(--luxury-dark)]/70 max-w-2xl mx-auto">
            Discover the most prestigious residential developments from renowned builders
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: FeaturedProject }) {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Header with Badge */}
      <div className="bg-[var(--luxury-navy)] p-6">
        <div className="flex items-start justify-between mb-3">
          <span className="bg-[var(--luxury-gold)] text-[var(--luxury-navy)] px-3 py-1 rounded-full text-xs font-semibold">
            {project.badge}
          </span>
          <Star className="h-5 w-5 text-[var(--luxury-gold)]" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          {project.name}
        </h3>
        <p className="text-white/80 text-sm line-clamp-2">
          {project.tagline}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        {project.description && (
          <p className="text-[var(--luxury-dark)]/70 text-sm mb-4 line-clamp-3">
            {project.description}
          </p>
        )}

        {/* Highlights */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-[var(--luxury-dark)]/50 uppercase tracking-wider mb-2">Highlights</p>
            <div className="flex flex-wrap gap-2">
              {project.highlights.slice(0, 3).map((highlight) => (
                <span
                  key={highlight}
                  className="bg-[var(--luxury-cream)] text-[var(--luxury-navy)] px-2 py-1 rounded text-xs"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Specs */}
        <div className="space-y-2 border-t border-[var(--luxury-border)] pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--luxury-dark)]/60">Price</span>
            <span className="font-bold text-[var(--luxury-navy)]">{project.specs.price}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--luxury-dark)]/60">Configuration</span>
            <span className="font-medium text-[var(--luxury-dark)]">{project.specs.config}</span>
          </div>
          {project.specs.size && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--luxury-dark)]/60">Size</span>
              <span className="font-medium text-[var(--luxury-dark)]">{project.specs.size}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--luxury-dark)]/60">Sector</span>
            <span className="font-medium text-[var(--luxury-dark)]">{project.specs.sector}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--luxury-dark)]/60">Status</span>
            <span className={`font-medium ${project.specs.status.includes('Ready') ? 'text-green-600' : 'text-blue-600'}`}>
              {project.specs.status}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          className="flex items-center justify-center gap-2 w-full bg-[var(--luxury-navy)] text-white py-3 rounded-lg font-medium hover:bg-[var(--luxury-gold)] hover:text-[var(--luxury-navy)] transition-colors mt-4"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
