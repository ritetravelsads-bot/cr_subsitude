import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Buy Luxury Properties in Gurgaon | 3 BHK, 4 BHK, Villas & Plots | CountryRoof",
  description:
    "RERA-verified luxury apartments, villas & plots in Gurgaon. Ready-to-move & new launch across Dwarka Expressway, Golf Course Road & SPR. Zero brokerage.",
  alternates: {
    canonical: "https://countryroof.in/properties",
  },
  openGraph: {
    title: "Buy Luxury Properties in Gurgaon | 3 BHK, 4 BHK, Villas & Plots | CountryRoof",
    description: "RERA-verified luxury apartments, villas & plots in Gurgaon. Ready-to-move & new launch across Dwarka Expressway, Golf Course Road & SPR. Zero brokerage.",
    url: "https://countryroof.in/properties",
  },
}

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
