'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Header({ setShowDonationForm, forceHide = false }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [mounted, setMounted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Debounce function to limit how often the scroll handler runs
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  // Handle scroll effect with useCallback to prevent recreating function on each render
  const controlHeader = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Determine if scrolled past threshold
    setScrolled(currentScrollY > 10);

    // Use a minimum threshold to avoid triggering on small movements
    if (Math.abs(currentScrollY - lastScrollY) < 5) return;

    // Determine scroll direction and visibility
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
      // Scrolling down - hide header
      setVisible(false);
    } else if (currentScrollY < lastScrollY || currentScrollY < 50) {
      // Scrolling up or near top - show header
      setVisible(true);
    }

    // Update last scroll position
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    setMounted(true);

    // Initial scroll position check
    setLastScrollY(window.scrollY);

    // Create debounced version of the scroll handler
    const debouncedControlHeader = debounce(controlHeader, 5);

    // Add event listener
    window.addEventListener('scroll', debouncedControlHeader, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', debouncedControlHeader);
    };
  }, [controlHeader]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileMenu]);

  const navItems = [
    { name: "ABOUT", href: "/about", isLink: true },
    { name: "PROGRAMS", href: "#programs" },
    { name: "IMPACT", href: "#impact" },
    { name: "TESTIMONIAL", href: "#testimonial" },
    { name: "GALLERY", href: "/gallery", isLink: true },
    { name: "GADI MARATHON 2026", href: "https://drive.google.com/drive/folders/1kI4mBYMXsN9sTSSWmGU50bQlGtnhWVHe?usp=sharing", isLink: true, isExternal: true },
    { name: "CONTACT", href: "/contact", isLink: true },
  ];

  return (
    <>
      <header
        className={`fixed w-full z-[100] ${
          visible && !forceHide ? 'translate-y-0' : '-translate-y-full'
        } ${
          scrolled
            ? "bg-white/95 shadow-sm backdrop-blur-md py-1.5 sm:py-2"
            : "bg-white/80 backdrop-blur-sm py-2 sm:py-2.5"
        }`}
        style={{ top: 0 }}
      >
        <div className="w-full px-3 sm:px-5 lg:px-10">
          <div className="flex items-center justify-between md:grid md:grid-cols-4">
            {/* Logo */}
            <div className="md:col-span-1">
              <Link
                href="/"
                className="flex items-center space-x-2 hover:opacity-80 cursor-pointer"
              >
              <div className="h-9 w-9 sm:h-10 sm:w-10 relative">
                <Image
                  src="/sitelogo.jpg"
                  alt="Janya Foundation Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-full"
                />
              </div>
                <div>
                  <span className="text-sm sm:text-base font-bold text-gray-900 tracking-tight font-sans block">
                    JANYA FOUNDATION
                  </span>
                  <p className="text-[10px] text-pink-500 font-medium font-sans">Empowering Women & Children</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="md:col-span-2 flex justify-center">
              <nav className="hidden md:flex items-center justify-center">
              <div className="flex items-center space-x-3 lg:space-x-1">
                {navItems.map((item, index) => (
                  item.isLink ? (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="px-3 py-1.5 text-gray-700 hover:text-pink-500 font-semibold text-xs relative group font-sans tracking-wide whitespace-nowrap"
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 hidden group-hover:block"></span>
                    </Link>
                  ) : isHomePage ? (
                    <a
                      key={item.name}
                      href={item.href}
                      className="px-3 py-1.5 text-gray-700 hover:text-pink-500 font-semibold text-xs relative group font-sans tracking-wide whitespace-nowrap"
                      onClick={(e) => {
                        e.preventDefault();
                        // Find the element to scroll to
                        let targetElement = document.querySelector(item.href);

                        // For testimonial section, we need to handle special case
                        if (item.name === "TESTIMONIAL") {
                          // First try to find dedicated testimonial section
                          const testimonialSection = document.querySelector("#testimonial-section");
                          if (testimonialSection) {
                            targetElement = testimonialSection;
                          }
                        }

                        // Scroll to the element if found
                        if (targetElement) {
                          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          // Close mobile menu if open
                          if (showMobileMenu) {
                            setShowMobileMenu(false);
                          }
                        }
                      }}
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 hidden group-hover:block"></span>
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      href={`/${item.href}`}
                      className="px-3 py-1.5 text-gray-700 hover:text-pink-500 font-semibold text-xs relative group font-sans tracking-wide whitespace-nowrap"
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-500 hidden group-hover:block"></span>
                    </Link>
                  )
                ))}
              </div>
            </nav>
          </div>

          {/* Mobile menu button and Donate Button */}
            <div className="md:col-span-1 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-1.5 text-gray-700 hover:text-pink-500 rounded-lg hover:bg-pink-50 border border-gray-200"
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Marathon Button */}
              <a 
                href="https://drive.google.com/drive/folders/1kI4mBYMXsN9sTSSWmGU50bQlGtnhWVHe?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="hidden md:flex bg-gradient-to-r from-[#374342] to-[#2D3B3A] text-white px-3 py-1.5 rounded-md font-semibold shadow-sm hover:shadow-md text-xs items-center space-x-1.5 whitespace-nowrap"
                >
                  <span>Gadi Marathon 2026</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </button>
              </a>

              {/* Donate Button */}
              <button
                onClick={() => setShowDonationForm(true)}
                className="hidden md:flex bg-gradient-to-r from-pink-500 to-pink-400 text-white px-3 py-1.5 rounded-md font-semibold shadow-sm hover:shadow-md text-xs items-center space-x-1.5 whitespace-nowrap"
              >
                <span>Donate Now</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu - Full screen overlay */}
          <div
            className={`md:hidden fixed inset-0 z-[500] transition-all duration-300 ${
              showMobileMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileMenu(false)}
            />

            {/* Menu Panel */}
            <div
              className={`absolute inset-0 w-full min-h-screen h-screen bg-white transform transition-transform duration-300 ease-out flex flex-col ${
                showMobileMenu ? 'translate-y-0' : 'translate-y-full'
              }`}
              style={{ height: '100dvh' }}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100 bg-white">
                <Link
                  href="/"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center space-x-3 hover:opacity-80"
                >
                  <div className="h-12 w-12 relative">
                    <Image
                      src="/sitelogo.jpg"
                      alt="Janya Foundation Logo"
                      fill
                      style={{ objectFit: 'contain' }}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">JANYA FOUNDATION</h2>
                    <p className="text-xs text-pink-500 font-medium">Empowering Women & Children</p>
                  </div>
                </Link>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2.5 rounded-full bg-gray-100 hover:bg-pink-100 text-gray-600 hover:text-pink-500 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="px-4 py-6 pb-24 space-y-2 overflow-y-auto bg-white flex-1">
                {navItems.map((item, index) => {
                  const menuIcons = {
                    "ABOUT": (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    "PROGRAMS": (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    ),
                    "IMPACT": (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    ),
                    "TESTIMONIAL": (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    ),
                    "GALLERY": (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    ),
                    "GADI MARATHON 2026": (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    "CONTACT": (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                  };

                  const itemContent = (
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center text-pink-500 group-hover:from-pink-100 group-hover:to-pink-200 transition-colors">
                        {menuIcons[item.name]}
                      </span>
                      <span className="text-gray-800 group-hover:text-pink-600 font-semibold text-sm tracking-wide transition-colors">
                        {item.name}
                      </span>
                      <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-pink-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  );

                  const itemClass = `group block px-3 py-3 rounded-lg hover:bg-pink-50 active:bg-pink-100 transition-all duration-200 transform ${
                    showMobileMenu ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                  }`;
                  const itemStyle = { transitionDelay: showMobileMenu ? `${index * 50}ms` : '0ms' };

                  return item.isLink ? (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setShowMobileMenu(false)}
                      className={itemClass}
                      style={itemStyle}
                    >
                      {itemContent}
                    </Link>
                  ) : isHomePage ? (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => {
                        e.preventDefault();
                        let targetElement = document.querySelector(item.href);
                        if (item.name === "TESTIMONIAL") {
                          const testimonialSection = document.querySelector("#testimonial-section");
                          if (testimonialSection) {
                            targetElement = testimonialSection;
                          }
                        }
                        if (targetElement) {
                          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          setShowMobileMenu(false);
                        }
                      }}
                      className={itemClass}
                      style={itemStyle}
                    >
                      {itemContent}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      href={`/${item.href}`}
                      onClick={() => setShowMobileMenu(false)}
                      className={itemClass}
                      style={itemStyle}
                    >
                      {itemContent}
                    </Link>
                  );
                })}
              </nav>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Buttons */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-2">
        <a
          href="https://drive.google.com/drive/folders/1kI4mBYMXsN9sTSSWmGU50bQlGtnhWVHe?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gradient-to-r from-[#374342] to-[#2D3B3A] text-white px-3 py-3 rounded-lg font-semibold shadow-sm active:scale-95 transition-all duration-300 text-sm flex items-center justify-center space-x-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Gadi Marathon 2026</span>
        </a>
        <button
          onClick={() => setShowDonationForm(true)}
          className="flex-1 bg-gradient-to-r from-pink-500 to-pink-400 text-white px-3 py-3 rounded-lg font-semibold shadow-sm active:scale-95 transition-all duration-300 text-sm flex items-center justify-center space-x-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Donate</span>
        </button>
        <a
          href="https://wa.me/919321496142"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-green-500 to-green-400 text-white p-3 rounded-lg shadow-sm active:scale-95 transition-all duration-300 flex items-center justify-center"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      </div>
    </>
  );
}
