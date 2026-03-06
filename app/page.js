import DonationPage from './components/DonationPage';
import Script from 'next/script';

export const metadata = {
  title: 'Janya Foundation | Official Website - Donate for Women & Children Empowerment',
  description: 'Janya Foundation (janyafoundation.in) - Official NGO website. Donate for breast cancer awareness, education for underprivileged children, women empowerment programs. 80G tax benefits available. Join Janya Foundation Marathon 2025.',
  keywords: 'janyafoundation, janya foundation, Janya Foundation official, janya foundation india, janyafoundation.in, janya foundation NGO, janya foundation donate, janya foundation marathon, NGO India, donate online, women empowerment, children education, breast cancer awareness, charity India, 80G donation',
  openGraph: {
    title: 'Janya Foundation - Empowering Women & Children',
    description: 'Join us in making a difference. Support breast cancer awareness, education, and women empowerment programs across India.',
    url: 'https://janyafoundation.in',
    siteName: 'Janya Foundation',
    images: [
      {
        url: 'https://janyafoundation.in/janya-logo.svg',
        width: 200,
        height: 200,
        alt: 'Janya Foundation Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Janya Foundation - Donate for Women & Children',
    description: 'Support breast cancer awareness, education, and women empowerment programs.',
  },
  alternates: {
    canonical: 'https://janyafoundation.in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

// WebSite Schema for Google Search Box
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Janya Foundation",
  "alternateName": ["janyafoundation", "Janya Foundation India"],
  "url": "https://janyafoundation.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://janyafoundation.in/?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// FAQ Schema for Rich Results
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is Janya Foundation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Janya Foundation is a registered NGO in India working for women empowerment, children education, breast cancer awareness, and healthcare initiatives. We are registered under 80G for tax benefits."
      }
    },
    {
      "@type": "Question",
      "name": "How can I donate to Janya Foundation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can donate online through our website janyafoundation.in. We accept all major payment methods including UPI, cards, and net banking. All donations are eligible for 80G tax benefits."
      }
    },
    {
      "@type": "Question",
      "name": "Is Janya Foundation donation eligible for tax exemption?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Janya Foundation is registered under Section 80G of Income Tax Act. All donations are eligible for 50% tax deduction."
      }
    },
    {
      "@type": "Question",
      "name": "What is Janya Foundation Marathon?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Janya Foundation Marathon is an annual charity run event with 5K, 10K, and 21K categories. Participants can also choose 'Run for Cause' option. All proceeds support women and children empowerment programs."
      }
    }
  ]
};

// Structured Data for Organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "Janya Foundation",
  "alternateName": ["janyafoundation", "Janya Foundation India", "Janya Foundation NGO"],
  "url": "https://janyafoundation.in",
  "logo": "https://janyafoundation.in/janya-logo.svg",
  "image": "https://janyafoundation.in/janya-logo.svg",
  "description": "Janya Foundation is a registered NGO in India working for women empowerment, children education, breast cancer awareness, and healthcare initiatives. Official website: janyafoundation.in",
  "foundingDate": "2020",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN",
    "addressRegion": "Maharashtra"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9321496142",
    "contactType": "customer service",
    "availableLanguage": ["English", "Hindi", "Marathi"]
  },
  "sameAs": [
    "https://www.facebook.com/janyafoundation",
    "https://www.instagram.com/janyafoundation"
  ],
  "knowsAbout": ["Women Empowerment", "Children Education", "Breast Cancer Awareness", "Healthcare", "Marathon Events"]
};

export default function Home() {
  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <DonationPage />
    </>
  );
}
