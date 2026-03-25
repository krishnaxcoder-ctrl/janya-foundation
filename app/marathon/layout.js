import Script from 'next/script';

export const metadata = {
  title: 'Janya Foundation Marathon 2026 - Register Now | Run for a Cause',
  description: 'Register for Janya Foundation Marathon 2026 at janyafoundation.in. Choose from 5K, 10K, 21K races or Run for Cause. Support women empowerment and children education. Early bird discounts available!',
  keywords: 'janyafoundation marathon, janya foundation marathon, janya foundation run, marathon registration, charity run India, 5K run, 10K run, half marathon, run for cause, Janya Foundation marathon 2026, running event India, charity marathon, janyafoundation.in marathon',
  openGraph: {
    title: 'Janya Foundation Marathon 2026 - Register Now',
    description: 'Join Janya Foundation Marathon 2026! Choose your race category - 5K, 10K, 21K or Run for Cause. Support women empowerment and children education.',
    url: 'https://janyafoundation.in/marathon',
    siteName: 'Janya Foundation',
    images: [
      {
        url: 'https://janyafoundation.in/marathon-qr.png',
        width: 400,
        height: 400,
        alt: 'Janya Foundation Marathon 2026',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Janya Foundation Marathon 2026',
    description: 'Register now for 5K, 10K, 21K races at janyafoundation.in. Run for women & children empowerment!',
  },
  alternates: {
    canonical: 'https://janyafoundation.in/marathon',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Event Schema for Google Events
const eventSchema = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  "name": "Janya Foundation Marathon 2026",
  "description": "Annual charity marathon organized by Janya Foundation. Choose from 5K, 10K, 21K races or Run for Cause option. All proceeds support women empowerment and children education.",
  "startDate": "2026-03-08T06:00:00+05:30",
  "endDate": "2026-03-08T12:00:00+05:30",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Navi Mumbai",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Navi Mumbai",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    }
  },
  "organizer": {
    "@type": "Organization",
    "name": "Janya Foundation",
    "url": "https://janyafoundation.in"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "5K Run",
      "price": "499",
      "priceCurrency": "INR",
      "url": "https://janyafoundation.in/marathon",
      "availability": "https://schema.org/InStock"
    },
    {
      "@type": "Offer",
      "name": "10K Run",
      "price": "799",
      "priceCurrency": "INR",
      "url": "https://janyafoundation.in/marathon",
      "availability": "https://schema.org/InStock"
    },
    {
      "@type": "Offer",
      "name": "21K Half Marathon",
      "price": "1199",
      "priceCurrency": "INR",
      "url": "https://janyafoundation.in/marathon",
      "availability": "https://schema.org/InStock"
    }
  ],
  "image": "https://janyafoundation.in/marathon-qr.png",
  "url": "https://janyafoundation.in/marathon"
};

export default function MarathonLayout({ children }) {
  return (
    <>
      <Script
        id="event-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
      />
      {children}
    </>
  );
}
