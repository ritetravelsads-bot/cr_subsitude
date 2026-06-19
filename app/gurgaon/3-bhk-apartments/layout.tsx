import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '3 BHK Apartments in Gurgaon 2025–26 | Price, Location & Buyer\'s Guide',
  description:
    'Find 3 BHK apartments in Gurgaon — new launch, under construction & ready to move. Compare prices across Golf Course Extension Road, Dwarka Expressway, Sohna Road and New Gurgaon on CountryRoof.',
  keywords: [
    '3 BHK apartments in Gurgaon',
    '3 BHK flats Gurgaon',
    '3 bedroom apartments Gurgaon',
    '3 BHK Gurgaon price 2025',
    '3 BHK Golf Course Extension Road',
    '3 BHK Dwarka Expressway',
    '3 BHK ready to move Gurgaon',
    '3 BHK new launch Gurgaon',
  ],
  openGraph: {
    title: '3 BHK Apartments in Gurgaon 2025–26 | Prices & Locations',
    description:
      'Find 3 BHK apartments in Gurgaon — new launch, under construction & ready to move across top corridors. Real prices, verified listings on CountryRoof.',
    type: 'website',
    url: 'https://countryroof.in/gurgaon/3-bhk-apartments',
    siteName: 'CountryRoof',
  },
  alternates: {
    canonical: 'https://countryroof.in/gurgaon/3-bhk-apartments',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
