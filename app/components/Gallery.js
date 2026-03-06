'use client';

import { useState, useEffect } from 'react';

export default function Gallery({ onDonateClick }) {
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});
  const [imageSources, setImageSources] = useState({});

  // Fallback image URL
  const fallbackImageUrl = "https://placehold.co/800x600/e2e8f0/1e40af?text=Image+Unavailable";

  const galleryImages = [
    // New images (Feb 2026) - displayed first
    {
      id: 10,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.38 PM.jpeg",
      title: "Janya Foundation Community Outreach",
      description: "Janya Foundation team engaging with the community in India",
      alt: "Janya Foundation NGO community outreach program India",
      category: "Community"
    },
    {
      id: 11,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.39 PM.jpeg",
      title: "Janya Foundation Health Initiative",
      description: "Healthcare awareness program by Janya Foundation",
      alt: "Janya Foundation healthcare awareness program India",
      category: "Healthcare"
    },
    {
      id: 12,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.40 PM.jpeg",
      title: "Janya Foundation Women's Program",
      description: "Empowering women through skill development at Janya Foundation",
      alt: "Janya Foundation women empowerment skill development India",
      category: "Women Empowerment"
    },
    {
      id: 13,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.40 PM (1).jpeg",
      title: "Janya Foundation Educational Workshop",
      description: "Interactive learning session with students by Janya Foundation",
      alt: "Janya Foundation education workshop children India",
      category: "Education"
    },
    {
      id: 14,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.40 PM (2).jpeg",
      title: "Janya Foundation Community Support",
      description: "Supporting underprivileged communities through Janya Foundation",
      alt: "Janya Foundation community support underprivileged India",
      category: "Community"
    },
    {
      id: 16,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.41 PM.jpeg",
      title: "Janya Foundation Awareness Drive",
      description: "Spreading awareness about important health issues",
      alt: "Janya Foundation health awareness drive cancer awareness India",
      category: "Healthcare"
    },
    {
      id: 17,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.41 PM (1).jpeg",
      title: "Janya Foundation Youth Engagement",
      description: "Engaging youth in community development programs",
      alt: "Janya Foundation youth engagement community development India",
      category: "Education"
    },
    {
      id: 18,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.41 PM (2).jpeg",
      title: "Janya Foundation Skill Training",
      description: "Vocational training for self-reliance by Janya Foundation",
      alt: "Janya Foundation vocational skill training women India",
      category: "Women Empowerment"
    },
    {
      id: 19,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.42 PM.jpeg",
      title: "Janya Foundation Community Event",
      description: "Foundation event bringing communities together",
      alt: "Janya Foundation community event gathering India NGO",
      category: "Community"
    },
    {
      id: 20,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.42 PM (1).jpeg",
      title: "Janya Foundation Healthcare Outreach",
      description: "Reaching remote areas with healthcare services",
      alt: "Janya Foundation healthcare outreach rural India medical camp",
      category: "Healthcare"
    },
    {
      id: 21,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.42 PM (2).jpeg",
      title: "Janya Foundation Education Initiative",
      description: "Providing educational resources to children",
      alt: "Janya Foundation education initiative children books India",
      category: "Education"
    },
    {
      id: 22,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.42 PM (3).jpeg",
      title: "Janya Foundation Empowerment Session",
      description: "Women participating in empowerment programs",
      alt: "Janya Foundation women empowerment session training India",
      category: "Women Empowerment"
    },
    {
      id: 23,
      src: "/galleryimages/WhatsApp Image 2026-02-08 at 5.09.43 PM.jpeg",
      title: "Janya Foundation Activity",
      description: "Janya Foundation making a difference in communities",
      alt: "Janya Foundation NGO activity community India",
      category: "Community"
    },
    // Older images
    {
      id: 1,
      src: "/galleryimages/IMG-20250524-WA0022.jpg",
      title: "Janya Foundation Community Workshop",
      description: "Women learning new skills in our empowerment program",
      alt: "Janya Foundation women workshop skill learning India",
      category: "Women Empowerment"
    },
    {
      id: 3,
      src: "/galleryimages/IMG-20250524-WA0024.jpg",
      title: "Janya Foundation Skill Development",
      description: "Women participating in vocational training programs",
      alt: "Janya Foundation skill development vocational training women",
      category: "Women Empowerment"
    },
    {
      id: 4,
      src: "/galleryimages/IMG-20250524-WA0025.jpg",
      title: "Janya Foundation Health Awareness",
      description: "Breast cancer awareness session in rural community",
      alt: "Janya Foundation breast cancer awareness rural India",
      category: "Healthcare"
    },
    {
      id: 5,
      src: "/galleryimages/IMG-20250524-WA0026.jpg",
      title: "Janya Foundation Learning Together",
      description: "Children engaged in interactive learning activities",
      alt: "Janya Foundation children learning education India",
      category: "Education"
    },
    {
      id: 6,
      src: "/galleryimages/IMG-20250524-WA0028.jpg",
      title: "Janya Foundation Medical Camp",
      description: "Free health checkup camp for women in rural areas",
      alt: "Janya Foundation free medical camp women rural India",
      category: "Healthcare"
    },
    {
      id: 7,
      src: "/galleryimages/IMG-20250524-WA0030.jpg",
      title: "Janya Foundation Graduation Day",
      description: "Students celebrating their educational achievements",
      alt: "Janya Foundation student graduation education success India",
      category: "Education"
    },
    {
      id: 8,
      src: "/galleryimages/WhatsApp Image 2025-05-24 at 19.14.58_c023c036.jpg",
      title: "Janya Foundation Entrepreneurship",
      description: "Women showcasing their handmade products at local market",
      alt: "Janya Foundation women entrepreneurship handmade products India",
      category: "Women Empowerment"
    },
    {
      id: 9,
      src: "/galleryimages/WhatsApp Image 2025-05-24 at 19.14.58_7c6904d8.jpg",
      title: "Janya Foundation Hygiene Education",
      description: "Teaching menstrual hygiene to teenage girls",
      alt: "Janya Foundation menstrual hygiene education girls India",
      category: "Healthcare"
    },
    {
      id: 2,
      src: "/galleryimages/IMG-20250524-WA0023.jpg",
      title: "Janya Foundation Education Support",
      description: "Children receiving educational materials and support",
      alt: "Janya Foundation children education support materials India",
      category: "Education"
    }
  ];

  useEffect(() => {
    setMounted(true);
    setIsLoaded(true);

    // Preload images to avoid loading spinner issues
    galleryImages.forEach(image => {
      const img = new window.Image();
      img.src = image.src;
      img.onload = () => handleImageLoad(image.id);
      img.onerror = () => handleImageLoad(image.id); // Mark as loaded even on error to avoid infinite loading

      // Set a timeout to mark image as loaded after 5 seconds regardless of status
      // This prevents infinite loading spinners if the image load events don't fire
      setTimeout(() => {
        handleImageLoad(image.id);
      }, 5000);
    });
  }, []);

  // Handle image loading
  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Handle image error as well
  const handleImageError = (id) => {
    // Set fallback image source
    setImageSources(prev => ({
      ...prev,
      [id]: fallbackImageUrl
    }));

    // Mark image as loaded even if it errors out
    handleImageLoad(id);
  };

  // Function to calculate random heights for masonry effect
  const getRandomHeight = (id) => {
    // Use the image id to deterministically set different heights
    // This ensures consistent heights between renders
    const heights = ['h-48', 'h-56', 'h-64', 'h-72'];
    return heights[id % heights.length];
  };

  // Function to navigate to next or previous image
  const navigateImage = (direction) => {
    if (!selectedImage) return;

    const currentIndex = galleryImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;

    if (direction === 'next') {
      newIndex = (currentIndex + 1) % galleryImages.length;
    } else {
      newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    }

    setSelectedImage(galleryImages[newIndex]);
  };

  // Handle key press for arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;

      if (e.key === 'ArrowRight') {
        navigateImage('next');
      } else if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <section id="gallery" className="py-24 px-2 sm:px-4 relative overflow-hidden w-full bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-100/40 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-fuchsia-100/30 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-rose-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-br from-fuchsia-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-pink-100/20 via-rose-100/20 to-fuchsia-100/20 rounded-full blur-3xl"></div>
      <div className="w-full relative">
        {/* Header with minimal design */}
        <div className="text-center mb-12">
          <div className="inline-block mb-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-[#f21b91]">
              <span className="flex h-2 w-2 mr-2">
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-[#f21b91] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f21b91]"></span>
              </span>
              Gallery Preview
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            <span className="relative">
              <span className="text-gray-900">Preview our</span> <span className="text-[#f21b91]">Work</span>
              <span className="absolute bottom-1 left-0 w-full h-2 bg-pink-100 -z-10 transform -rotate-1"></span>
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A glimpse of our impact through visual storytelling
          </p>
        </div>

        {/* Masonry Gallery Grid - Full Width */}
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="break-inside-avoid mb-6 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl cursor-pointer"
              onClick={() => setSelectedImage(image)}
            >
              <div className="relative overflow-hidden">
                {!loadedImages[image.id] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                  </div>
                )}
                <img
                  src={imageSources[image.id] || image.src}
                  alt={image.alt || image.title}
                  title={image.title}
                  className={`w-full object-contain ${loadedImages[image.id] ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => handleImageLoad(image.id)}
                  onError={() => handleImageError(image.id)}
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Simplified Modal with Image Slider */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Navigation buttons */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 text-white rounded-full flex items-center justify-center z-10 hover:bg-black/60"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="w-full h-full flex items-center justify-center">
              <img
                src={selectedImage && (imageSources[selectedImage.id] || selectedImage.src)}
                alt={selectedImage && (selectedImage.alt || selectedImage.title)}
                title={selectedImage && selectedImage.title}
                className="max-h-full max-w-full object-contain"
                onError={() => selectedImage && handleImageError(selectedImage.id)}
              />
            </div>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/40 text-white rounded-full flex items-center justify-center z-10 hover:bg-black/60"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
