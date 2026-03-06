import { Inter, Inter_Tight } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import WhatsAppButton from "./components/WhatsAppButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  metadataBase: new URL('https://janyafoundation.in'),
  title: {
    default: 'Janya Foundation - NGO for Women & Children Empowerment in India',
    template: '%s | Janya Foundation',
  },
  description: "Janya Foundation (janyafoundation.in) is a registered NGO in India. Donate for breast cancer awareness, education for underprivileged children, and women's income generation programs. 80G tax benefits available.",
  keywords: "janyafoundation, Janya Foundation, janya foundation india, janya foundation NGO, NGO India, donate online, women empowerment, children education, breast cancer awareness, charity India, 80G donation, janya foundation marathon",
  authors: [{ name: 'Janya Foundation' }],
  creator: 'Janya Foundation',
  publisher: 'Janya Foundation',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://janyafoundation.in',
    siteName: 'Janya Foundation',
    title: 'Janya Foundation - NGO for Women & Children',
    description: 'Donate to support breast cancer awareness, education, and women empowerment programs across India.',
    images: [
      {
        url: '/janya-logo.svg',
        width: 200,
        height: 200,
        alt: 'Janya Foundation Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Janya Foundation',
    description: 'NGO for Women & Children Empowerment in India',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '_gJxuimR0PKTSoBOA7_E_a0rg5HJSHichhuYELTYXyg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '555306820676727');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=555306820676727&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MS35L4KY06"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MS35L4KY06');
          `}
        </Script>
        {/* End Google Analytics */}
      </head>
      <body
        className={`${inter.variable} ${interTight.variable} antialiased font-body`}
      >
        {children}

        {/* WhatsApp Floating Button - hidden on dashboard */}
        <WhatsAppButton />

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}
