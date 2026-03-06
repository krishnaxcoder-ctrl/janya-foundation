export const metadata = {
  title: 'Terms of Service - Janya Foundation | User Agreement',
  description: 'Read the terms of service for using Janya Foundation\'s website, making donations, and registering for events.',
  keywords: 'terms of service, user agreement, terms and conditions, Janya Foundation terms',
  openGraph: {
    title: 'Terms of Service - Janya Foundation',
    description: 'Terms and conditions for using our platform and services.',
    url: 'https://janyafoundation.in/terms-of-service',
    siteName: 'Janya Foundation',
    type: 'website',
  },
  alternates: {
    canonical: 'https://janyafoundation.in/terms-of-service',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsLayout({ children }) {
  return children;
}
