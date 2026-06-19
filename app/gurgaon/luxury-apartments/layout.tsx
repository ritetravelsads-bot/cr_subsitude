import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luxury Apartments in Gurgaon 2026 | Premium Flats, Top Projects & Prices',
  description:
    'Explore luxury apartments in Gurgaon — premium flats, ultra-luxury homes, new launches & ready-to-move projects on Golf Course Road, GCER & Dwarka Expressway: verified listings, real prices, expert guidance on CountryRoof.',
  keywords: [
    'luxury apartments in Gurgaon',
    'premium flats Gurgaon',
    'luxury homes Gurgaon',
    'Golf Course Road apartments',
    'GCER luxury apartments',
    'Dwarka Expressway luxury',
    'DLF luxury apartments',
    'ultra luxury apartments Gurgaon',
    '4 BHK luxury Gurgaon',
  ],
  openGraph: {
    title: 'Luxury Apartments in Gurgaon 2026 | Premium Flats & Top Projects',
    description:
      'Explore verified luxury apartments in Gurgaon across Golf Course Road, GCER and Dwarka Expressway. Real prices, RERA-registered projects, expert guidance.',
    type: 'website',
    url: 'https://countryroof.in/gurgaon/luxury-apartments',
    siteName: 'CountryRoof',
  },
  alternates: {
    canonical: 'https://countryroof.in/gurgaon/luxury-apartments',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
