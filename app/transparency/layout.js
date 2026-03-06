export const metadata = {
  title: 'Transparency & Accountability - Janya Foundation | Fund Utilization Report',
  description: 'View Janya Foundation (janyafoundation.in) financial transparency report. See how your donations are utilized for cancer awareness, education, women empowerment, and healthcare programs.',
  keywords: 'janyafoundation transparency, janya foundation fund utilization, NGO transparency India, financial accountability, charity transparency, donation utilization report, janya foundation annual report',
  openGraph: {
    title: 'Transparency & Accountability - Janya Foundation',
    description: 'See how your donations make an impact. Complete financial breakdown and fund utilization report.',
    url: 'https://janyafoundation.in/transparency',
    siteName: 'Janya Foundation',
    type: 'website',
  },
  alternates: {
    canonical: 'https://janyafoundation.in/transparency',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TransparencyLayout({ children }) {
  return children;
}
