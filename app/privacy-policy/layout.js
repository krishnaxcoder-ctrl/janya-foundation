export const metadata = {
  title: 'Privacy Policy - Janya Foundation | Data Protection',
  description: 'Read Janya Foundation\'s privacy policy. Learn how we collect, use, and protect your personal information when you donate or register for events.',
  keywords: 'privacy policy, data protection, Janya Foundation, NGO privacy, donor privacy',
  openGraph: {
    title: 'Privacy Policy - Janya Foundation',
    description: 'How we protect your personal information and data.',
    url: 'https://janyafoundation.in/privacy-policy',
    siteName: 'Janya Foundation',
    type: 'website',
  },
  alternates: {
    canonical: 'https://janyafoundation.in/privacy-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPolicyLayout({ children }) {
  return children;
}
