export const metadata = {
  title: 'Refund Policy - Janya Foundation | Donation & Registration Refunds',
  description: 'Janya Foundation\'s refund policy for donations and marathon registrations. Learn about our refund process and eligibility criteria.',
  keywords: 'refund policy, donation refund, marathon registration refund, NGO refund policy',
  openGraph: {
    title: 'Refund Policy - Janya Foundation',
    description: 'Our refund policy for donations and event registrations.',
    url: 'https://janyafoundation.in/refund-policy',
    siteName: 'Janya Foundation',
    type: 'website',
  },
  alternates: {
    canonical: 'https://janyafoundation.in/refund-policy',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RefundPolicyLayout({ children }) {
  return children;
}
