export const metadata = {
  title: 'NGO Registration Details - Janya Foundation | DARPAN & Legal Info',
  description: 'View Janya Foundation\'s official NGO registration details, DARPAN ID, 80G certification, and legal documentation.',
  keywords: 'NGO registration, DARPAN ID, 80G certification, registered NGO India, charity registration',
  openGraph: {
    title: 'Registration Details - Janya Foundation',
    description: 'Official NGO registration, DARPAN ID, and legal documentation.',
    url: 'https://janyafoundation.in/registration-details',
    siteName: 'Janya Foundation',
    type: 'website',
  },
  alternates: {
    canonical: 'https://janyafoundation.in/registration-details',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RegistrationDetailsLayout({ children }) {
  return children;
}
