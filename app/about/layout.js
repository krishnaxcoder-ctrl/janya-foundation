export const metadata = {
  title: 'About Janya Foundation - Our Mission, Vision & Team',
  description: 'Learn about Janya Foundation (janyafoundation.in), a registered NGO in India. Discover our mission to empower women and children through education, healthcare, and breast cancer awareness programs.',
  keywords: 'about janyafoundation, janya foundation about us, janya foundation team, janya foundation mission, janya foundation vision, NGO India about, janyafoundation.in about, who is janya foundation',
  openGraph: {
    title: 'About Janya Foundation - Our Mission & Vision',
    description: 'Learn about Janya Foundation, a registered NGO working for women empowerment and children education in India.',
    url: 'https://janyafoundation.in/about',
    siteName: 'Janya Foundation',
    type: 'website',
  },
  alternates: {
    canonical: 'https://janyafoundation.in/about',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AboutLayout({ children }) {
  return children;
}
