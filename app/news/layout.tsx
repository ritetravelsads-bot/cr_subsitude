import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Real Estate News | CountryRoof - Latest Property Updates",
  description:
    "Stay updated with the latest real estate news, market trends, and property updates from Gurugram and Delhi NCR.",
  alternates: {
    canonical: "https://countryroof.in/news",
  },
  openGraph: {
    title: "Real Estate News | CountryRoof",
    description: "Latest real estate news and property market updates from Gurugram.",
    url: "https://countryroof.in/news",
  },
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
