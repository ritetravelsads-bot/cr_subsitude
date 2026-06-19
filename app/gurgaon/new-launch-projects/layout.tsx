import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Launch Projects in Gurgaon 2025–26 | RERA Approved Luxury Homes',
  description:
    'Explore the latest new launch projects in Gurgaon — luxury apartments, premium residences, and RERA-approved developments across top corridors. Get expert guidance before you invest.',
  keywords: [
    'new launch projects Gurgaon',
    'new launch apartments Gurgaon',
    'RERA approved projects Gurgaon',
    'Golf Course Extension Road new launch',
    'Dwarka Expressway new projects',
    'new launch luxury Gurgaon 2025',
    'new launch Gurgaon 2026',
    'pre-launch projects Gurgaon',
  ],
  openGraph: {
    title: 'New Launch Projects in Gurgaon 2025–26 | RERA Approved Luxury Homes',
    description:
      'Latest new launch projects in Gurgaon — luxury apartments and RERA-approved developments across top corridors. Expert buyer guidance.',
    type: 'website',
    url: 'https://countryroof.in/gurgaon/new-launch-projects',
    siteName: 'CountryRoof',
  },
  alternates: {
    canonical: 'https://countryroof.in/gurgaon/new-launch-projects',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
