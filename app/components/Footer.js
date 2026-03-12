'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <footer id="footer" className="relative bg-white text-gray-700 overflow-hidden">
      {/* Top pink accent line */}
      <div className="h-[3px] bg-gradient-to-r from-pink-400 via-pink-500 to-pink-400"></div>

      {/* Main Footer Content */}
      <div className="max-w-[1360px] mx-auto px-5 sm:px-6 lg:px-10 pt-12 pb-8">

        {/* Top Section - Logo + CTA */}
        <div className="mb-4 pb-8 border-b border-gray-100">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
              <div className="h-14 w-14 relative ring-2 ring-pink-100 rounded-full overflow-hidden shadow-md">
                <Image
                  src="/sitelogo.jpg"
                  alt="Janya Foundation Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">JANYA FOUNDATION</h3>
                <p className="text-pink-500 text-[11px] font-semibold uppercase tracking-wider">Empowering Women & Children</p>
              </div>
            </Link>

            {/* Divider - desktop only */}
            <div className="hidden md:block w-px h-12 bg-gray-200 mx-2"></div>

            {/* Description + CTA */}
            <div className="flex flex-col md:flex-row flex-1 items-start md:items-center justify-between gap-5">
              <p className="text-gray-500 text-sm max-w-xl leading-relaxed">
                Janya Foundation is dedicated to creating lasting change through breast cancer awareness, education for underprivileged children, women's empowerment programs, and healthcare support.
              </p>

              <div className="flex flex-col items-start md:items-end gap-2 flex-shrink-0">
                <Link
                  href={isHomePage ? "#donate" : "/#donate"}
                  className="group flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg shadow-pink-200 hover:shadow-pink-300"
                >
                  <span>Donate Now</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Explore</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href={isHomePage ? "#about" : "/#about"} className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={isHomePage ? "#programs" : "/#programs"} className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
                  Our Programs
                </Link>
              </li>
              <li>
                <Link href={isHomePage ? "#impact" : "/#impact"} className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
                  Impact Stories
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
                  Gallery
                </Link>
              </li>

            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/donation-policy" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
                  Donation Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/transparency" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
                  Transparency
                </Link>
              </li>
              <li>
                <Link href="/registration-details" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
                  Registration Details
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <svg className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-600">Ulwe, Navi Mumbai, Maharashtra</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="text-sm text-gray-600">
                  <a href="tel:+919867275101" className="hover:text-pink-500 transition-colors">9867275101</a>
                  <span className="text-gray-300 mx-1">/</span>
                  <a href="tel:+919321496142" className="hover:text-pink-500 transition-colors">9321496142</a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-pink-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:janyafoundation.04@gmail.com" className="text-sm text-gray-600 hover:text-pink-500 transition-colors">
                  janyafoundation.04@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Trust & Credentials */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Credentials</h4>
            <div className="space-y-3">
              <div className="bg-pink-50/80 rounded-lg p-3 border border-pink-100">
                <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">NGO Registration</p>
                <Link href="/registration-details" className="text-sm text-pink-500 hover:text-pink-600 font-medium transition-colors">
                  Raigad/0000004/2025
                </Link>
              </div>
              <div className="bg-pink-50/80 rounded-lg p-3 border border-pink-100">
                <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">DARPAN ID</p>
                <p className="text-sm text-gray-800 font-medium">MH/2025/0529327</p>
              </div>
              <div className="bg-pink-50/80 rounded-lg p-3 border border-pink-100">
                <p className="text-[10px] text-gray-400 uppercase font-semibold mb-1">Tax Exemption</p>
                <p className="text-sm text-gray-800 font-medium">80G & 12A Certified</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - extra bottom padding on mobile for floating buttons */}
      <div className="border-t border-gray-100 bg-gray-50/50">
        <div className="max-w-[1360px] mx-auto px-5 sm:px-6 lg:px-10 py-4 pb-20 md:pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-xs">
            &copy; 2025 Janya Foundation. All rights reserved.
          </p>
          <div className="flex items-center gap-2.5">
            <a
              href="https://www.instagram.com/janya_foundation/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-pink-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
            >
              <FaInstagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61574484078498"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-pink-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
            >
              <FaFacebook className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/919321496142?text=Hi, I need help"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-green-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
            >
              <FaWhatsapp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
