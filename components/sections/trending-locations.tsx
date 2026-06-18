"use client"

import Link from "next/link"
import Image from "next/image"
import { MapPin, TrendingUp } from "lucide-react"

const trendingLocations = [
  {
    name: "Golf Course Road",
    properties: "200+ Properties",
    image: "/locations/golf-course-road.jpg",
    slug: "golf-course-road",
  },
  {
    name: "Golf Course Extn Road",
    properties: "160+ Properties",
    image: "/locations/golf-course-extension.jpg",
    slug: "golf-course-extn-road",
  },
  {
    name: "Dwarka Expressway",
    properties: "180+ Properties",
    image: "/locations/dwarka-expressway.jpg",
    slug: "dwarka-expressway",
  },
  {
    name: "Southern Peripheral Road",
    properties: "90+ Properties",
    image: "/locations/southern-peripheral-road.jpg",
    slug: "southern-peripheral-road",
  },
  {
    name: "Sohna",
    properties: "150+ Properties",
    image: "/locations/sohna.jpg",
    slug: "sohna",
  },
  {
    name: "New Gurgaon",
    properties: "120+ Properties",
    image: "/locations/new-gurgaon.jpg",
    slug: "new-gurgaon",
  },
  {
    name: "NH-48",
    properties: "110+ Properties",
    image: "/locations/nh-48.jpg",
    slug: "nh-48",
  },
  {
    name: "Manesar",
    properties: "80+ Properties",
    image: "/locations/manesar.jpg",
    slug: "manesar",
  },
]

export default function TrendingLocations() {
  return (
    <section className="py-16 px-4 md:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-3">
          <TrendingUp className="h-8 w-8 text-[#002366]" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#002366] text-center">Prime Investment Corridors</h2>
        </div>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Invest in rapidly developing Gurugram areas with strong appreciation potential
        </p>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {trendingLocations.map((location) => (
            <Link
              key={location.name}
              href={`/${location.slug}`}
              className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-[transform,box-shadow] duration-300 bg-white min-h-[120px] md:min-h-[200px]"
            >
              <div className="relative h-32 md:h-48 overflow-hidden bg-slate-200">
                <Image
                  src={location.image || "/placeholder.svg"}
                  alt={location.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  quality={75}
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                  <MapPin className="h-4 w-4 md:h-5 md:w-5 text-white shrink-0" />
                  <h3 className="text-sm md:text-lg font-bold text-white line-clamp-1">{location.name}</h3>
                </div>
                <p className="text-xs md:text-sm text-white/90">{location.properties}</p>
              </div>
              <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-[#002366] text-white text-[10px] md:text-xs font-semibold px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                Trending
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
