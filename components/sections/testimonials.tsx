"use client"

import { useState } from "react"
import { Star, Quote, ChevronLeft, ChevronRight, MapPin, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    id: 1,
    name: "Rajesh M.",
    location: "Gurgaon",
    property_bought: "4 BHK in Sector 63A",
    rating: 5,
    text: "Bought 4 BHK in Sector 63A through CountryRoof — zero brokerage, smooth process. The team handled everything from site visits to documentation without any hassle.",
  },
  {
    id: 2,
    name: "Sunita & Vikram Nair",
    location: "Gurugram",
    property_bought: "3 BHK on Golf Course Extension Road",
    rating: 5,
    text: "We were NRIs looking for a trusted advisor in Gurgaon. CountryRoof gave us complete transparency — RERA details, developer background, and pricing. Closed the deal remotely in two weeks.",
  },
  {
    id: 3,
    name: "Arun Khanna",
    location: "Delhi",
    property_bought: "3 BHK on Dwarka Expressway",
    rating: 5,
    text: "CountryRoof did not push us toward expensive options. They understood our budget and lifestyle, and recommended only what fit. The advisory approach is genuinely different.",
  },
  {
    id: 4,
    name: "Meera & Suresh Iyer",
    location: "Gurugram",
    property_bought: "Senior-Friendly 3 BHK in Sector 57",
    rating: 5,
    text: "My parents needed a ground-floor, lift-accessible home near a hospital. CountryRoof found exactly that — and even helped with the documentation. Truly went above and beyond.",
  },
  {
    id: 5,
    name: "Priya Malhotra",
    location: "Dwarka Expressway",
    property_bought: "4 BHK on Golf Course Road",
    rating: 5,
    text: "I had visited multiple brokers before CountryRoof. The difference is their market knowledge — they know each project, each tower, and the actual going rate. That saved me lakhs.",
  },
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const current = testimonials[currentIndex]

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-6 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#002366] text-white text-xs font-bold tracking-widest uppercase mb-6 rounded-sm">
            <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
            Client Stories
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#002366] tracking-tight text-balance mb-3">
            Trusted by Real Buyers
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Real clients. Real properties. Real experiences with CountryRoof.
          </p>
        </div>

        {/* Main Card */}
        <div className="relative bg-white rounded-2xl shadow-lg border border-slate-100 p-8 md:p-12 max-w-4xl mx-auto">
          {/* Large quote mark */}
          <Quote className="absolute top-6 left-6 text-[#002366]/8" size={72} strokeWidth={1} />

          <div className="relative space-y-7">
            {/* Stars */}
            <div className="flex gap-1">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Review text */}
            <p className="text-lg md:text-xl leading-relaxed text-foreground/85 italic text-pretty">
              &ldquo;{current.text}&rdquo;
            </p>

            {/* Reviewer info */}
            <div className="flex items-start justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <p className="font-bold text-[#002366] text-lg">{current.name}</p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Home size={13} className="text-[#002366]/60 shrink-0" />
                  <span>{current.property_bought}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin size={13} className="text-[#002366]/60 shrink-0" />
                  <span>{current.location}</span>
                </div>
              </div>

              {/* Dots + nav */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="flex gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={prevTestimonial}
                    className="rounded-full w-9 h-9 border-2 hover:bg-[#002366] hover:text-white hover:border-[#002366] bg-transparent transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextTestimonial}
                    className="rounded-full w-9 h-9 border-2 hover:bg-[#002366] hover:text-white hover:border-[#002366] bg-transparent transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
                <div className="flex gap-1.5">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                          ? "w-7 bg-[#002366]"
                          : "w-2 bg-slate-300 hover:bg-slate-400"
                        }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex justify-center gap-3 mt-8 flex-wrap">
          {testimonials.map((t, index) => (
            <button
              key={t.id}
              onClick={() => setCurrentIndex(index)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${index === currentIndex
                  ? "bg-[#002366] text-white border-[#002366]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#002366] hover:text-[#002366]"
                }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
