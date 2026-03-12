'use client';

import { useState, useEffect, useRef, useCallback, memo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';

const IMAGES = [
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.38 PM.jpeg",
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.39 PM.jpeg",
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.40 PM.jpeg",
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.40 PM (1).jpeg",
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.40 PM (2).jpeg",
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.41 PM.jpeg",
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.41 PM (1).jpeg",
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.41 PM (2).jpeg",
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.42 PM.jpeg",
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.42 PM (1).jpeg",
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.42 PM (2).jpeg",
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.42 PM (3).jpeg",
  "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.43 PM.jpeg",
  "/galleryimages/IMG-20250524-WA0022.jpg",
  "/galleryimages/IMG-20250524-WA0024.jpg",
  "/galleryimages/IMG-20250524-WA0025.jpg",
  "/galleryimages/IMG-20250524-WA0026.jpg",
  "/galleryimages/IMG-20250524-WA0028.jpg",
  "/galleryimages/IMG-20250524-WA0030.jpg",
  "/galleryimages/WhatsApp Image 2025-05-24 at 19.14.58_c023c036.jpg",
  "/galleryimages/WhatsApp Image 2025-05-24 at 19.14.58_7c6904d8.jpg",
  "/galleryimages/IMG-20250524-WA0023.jpg"
];

const STATS = [
  { value: '1000+', label: 'Lives Impacted' },
  { value: '50+', label: 'Villages Reached' },
  { value: '12', label: 'Health Camps' },
  { value: '500+', label: 'Volunteers' },
];

// 6.3 Hoist static JSX elements
const BackgroundDecoration = () => (
  <>
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fuchsia-200/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-100/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
    </div>
    <div 
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }}
    />
  </>
);

// 5.6 Extract to Memoized Components for isolation
const GalleryItem = memo(({ src, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="break-inside-avoid mb-4 sm:mb-5 group cursor-pointer" onClick={() => onClick(src)}>
      <div className="relative overflow-hidden rounded-md bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 min-h-[200px]">
            <div className="w-8 h-8 border-2 border-pink-300 border-t-pink-500 rounded-full animate-spin" />
          </div>
        )}
        <img
          src={src}
          alt="Janya Foundation Gallery"
          className={`w-full object-cover transition-all duration-700 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      </div>
    </div>
  );
});

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Lock body scroll when lightbox is open
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedImage]);

  // 7.8 Early return / Simplified navigation
  const navigate = useCallback((dir) => {
    if (!selectedImage) return;
    const idx = IMAGES.indexOf(selectedImage);
    const nextIdx = dir === 'next' ? (idx + 1) % IMAGES.length : (idx - 1 + IMAGES.length) % IMAGES.length;
    setSelectedImage(IMAGES[nextIdx]);
  }, [selectedImage]);

  // Keyboard navigation
  useEffect(() => {
    if (!selectedImage) return;
    const handle = (e) => {
      if (e.key === 'ArrowRight') navigate('next');
      else if (e.key === 'ArrowLeft') navigate('prev');
      else if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [selectedImage, navigate]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white overflow-hidden pt-14 sm:pt-16">
        <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-fuchsia-50 border-b border-gray-100">
          <BackgroundDecoration />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 lg:py-16 text-left">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-pink-100/50 backdrop-blur-sm rounded-full border border-pink-200/50">
                <div className="flex h-2 w-2 relative">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
                </div>
                <span className="text-sm font-medium text-pink-700">{IMAGES.length} Moments Captured</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-gray-900 mb-6 leading-[1.1] tracking-tight" style={{ fontFamily: 'sohne-var, sans-serif' }}>
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500">Gallery</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed mb-10">
                A visual journey of our impact across India.
              </p>

              <div className="flex flex-wrap gap-8 sm:gap-12 justify-start">
                {STATS.map((stat) => (
                  <div key={stat.label} className="group">
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 group-hover:text-pink-500 transition-colors duration-300">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-500 mt-1 uppercase tracking-wider font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-8 sm:py-12 bg-white">
          <div className="relative w-full px-2 sm:px-4 lg:px-6">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 sm:gap-4">
              {IMAGES.map((src) => (
                <GalleryItem key={src} src={src} onClick={setSelectedImage} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-6 tracking-tight" style={{ fontFamily: 'sohne-var, sans-serif' }}>
              Support Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">Mission</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-sm font-semibold rounded-full hover:shadow-lg transition-all">Donate Now</Link>
              <Link href="/contact" className="px-8 py-4 bg-white/10 text-sm font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all">Contact Us</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {selectedImage && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8" onClick={() => setSelectedImage(null)}>
          <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center z-50 transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>

          <button className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center z-50 transition-all" onClick={(e) => { e.stopPropagation(); navigate('prev'); }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div className="max-w-5xl w-full max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Preview" className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl" />
          </div>

          <button className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center z-50 transition-all" onClick={(e) => { e.stopPropagation(); navigate('next'); }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          <div className="absolute bottom-4 text-white/50 text-sm">{IMAGES.indexOf(selectedImage) + 1} / {IMAGES.length}</div>
        </div>
      )}
    </>
  );
}
