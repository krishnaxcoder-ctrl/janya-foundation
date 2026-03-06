export const metadata = {
  title: 'Marathon Route Map - Janya Foundation Marathon 2025',
  description: 'View the interactive route map for Janya Foundation Marathon 2025. See start point, water stations, and finish line locations.',
  keywords: 'marathon route, race map, running route, Janya Foundation marathon route, race course',
  openGraph: {
    title: 'Marathon Route Map - Janya Foundation',
    description: 'Interactive route map with waypoints and navigation.',
    url: 'https://janyafoundation.in/route-map',
    siteName: 'Janya Foundation',
    type: 'website',
  },
  alternates: {
    canonical: 'https://janyafoundation.in/route-map',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RouteMapLayout({ children }) {
  return children;
}
