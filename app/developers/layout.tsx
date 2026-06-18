import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Top Real Estate Developers in Gurugram | CountryRoof",
  description:
    "Explore trusted real estate developers in Gurugram and Delhi NCR. Find verified builders with premium residential and commercial projects.",
  alternates: {
    canonical: "https://countryroof.in/developers",
  },
  openGraph: {
    title: "Real Estate Developers | CountryRoof",
    description: "Browse top real estate developers and builders in Gurugram.",
    url: "https://countryroof.in/developers",
  },
}

export default function DevelopersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
