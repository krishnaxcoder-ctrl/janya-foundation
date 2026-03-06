'use client';

export default function PartnersAndHelp() {
  return (
    <>
      {/* Sponsored Partners */}
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <p className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-2">Proudly Associated With</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Our Partners</h2>
            <p className="text-sm sm:text-base text-gray-500 w-full">Together we make a difference. Thank you to all our sponsors and partners for supporting our mission.</p>
          </div>

          {/* Ammdar Sponsor - Above All */}
          <div className="flex justify-center mb-6">
            <div className="relative w-full max-w-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-2xl blur-sm opacity-50"></div>
              <div className="relative flex flex-row items-center gap-3 sm:gap-4 border-2 border-yellow-500 rounded-2xl pr-4 sm:pr-6 bg-gradient-to-br from-yellow-50 via-white to-amber-50 shadow-lg">
                <div className="flex items-center justify-center h-28 sm:h-44 w-28 sm:w-44 flex-shrink-0 bg-white rounded-xl p-2 sm:p-3 shadow-inner">
                  <img src="/ammdar.jpeg" alt="Ammdar Sponsor" className="h-full w-full object-contain" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] sm:text-xs font-bold text-amber-600 uppercase tracking-widest mb-0.5 sm:mb-1">Proudly Supported By</p>
                  <p className="text-sm sm:text-xl font-bold text-gray-800 leading-tight">Aamdar Vikrant Dada Patil</p>
                </div>
              </div>
            </div>
          </div>

          {/* Title & Co Title Sponsors - Row 1 (Larger) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-5 w-full max-w-4xl mx-auto mb-4">
            <div className="flex flex-col border-2 border-yellow-500 rounded-lg p-3 sm:p-4 bg-yellow-50/50">
              <p className="text-xs sm:text-sm font-bold text-yellow-700 uppercase tracking-wide text-center mb-2">Title Sponsor</p>
              <div className="flex items-center justify-center h-24 sm:h-32 md:h-40 flex-1">
                <img alt="Title Sponsor" className="h-full w-auto object-contain" src="/JP Logo __1_page-0001.jpg" />
              </div>
            </div>
            <div className="flex flex-col border-2 border-yellow-500 rounded-lg p-3 sm:p-4 bg-yellow-50/50">
              <p className="text-xs sm:text-sm font-bold text-yellow-700 uppercase tracking-wide text-center mb-2">Co Title Sponsor</p>
              <div className="flex items-center justify-center h-24 sm:h-32 md:h-40 flex-1">
                <img alt="Co Title Sponsor" className="h-full w-auto object-contain" src="/Mumbai 81083 25218 (1).png" />
              </div>
            </div>
          </div>

          {/* Associate Sponsors - Row 2 (Smaller) */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 w-full max-w-2xl mx-auto mb-8">
            <div className="flex flex-col border-2 border-yellow-500 rounded p-2 bg-yellow-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-yellow-700 uppercase tracking-wide text-center mb-1">Associate Sponsor</p>
              <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 flex-1">
                <img alt="Associate Sponsor" className="h-full w-auto object-contain" src="/1.png" />
              </div>
            </div>
            <div className="flex flex-col border-2 border-yellow-500 rounded p-2 bg-yellow-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-yellow-700 uppercase tracking-wide text-center mb-1">Associate Sponsor</p>
              <div className="flex items-center justify-center h-16 sm:h-20 md:h-24 flex-1">
                <img alt="Associate Sponsor" className="h-full w-auto object-contain" src="/shreeji.png" />
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-1">Sponsored & Supported by</h3>
          <p className="text-xs text-gray-500 mb-6">Proudly supported by our amazing partners</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-5xl mx-auto">
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Hydration Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Hydration Partner" className="h-full w-auto object-contain" src="/partner-pocari.png" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Technology Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Technology Partner" className="h-full w-auto object-contain" src="/partner-reliance.jpg" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Associate Sponsor</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Associate Sponsor" className="h-full w-auto object-contain" src="/janyafarmsnew.png" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Beverage Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Beverage Partner" className="h-full w-auto object-contain" src="/partner-logo1.png" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Sports Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Sports Partner" className="h-full w-auto object-contain" src="/partner-logo21.png" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Hygiene Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Hygiene Partner" className="h-full w-auto object-contain" src="/partner-plush.jpg" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Entertainment Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Entertainment Partner" className="h-full w-auto object-contain" src="/Mumbai 81083 25218.png" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Education Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Education Partner" className="h-full w-auto object-contain" src="/kamothe.png" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Zumba Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Zumba Partner" className="h-full w-auto object-contain" src="/zumba patner.jpg" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Venue Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Venue Partner" className="h-full w-auto object-contain" src="/newbd.png" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Medical Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Medical Partner" className="h-full w-auto object-contain" src="/2.png" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Dairy Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Dairy Partner" className="h-full w-auto object-contain" src="/Mumbai 81083 25218 (2).png" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Energy Drink Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Energy Drink Partner" className="h-full w-auto object-contain" src="/enerzal1.png" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Beverage Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Beverage Partner" className="h-full w-auto object-contain" src="/yakult1.png" />
              </div>
            </div>
            <div className="flex flex-col border border-pink-200 rounded p-2 bg-pink-50/50">
              <p className="text-[10px] sm:text-xs font-bold text-pink-700 uppercase tracking-wide text-center mb-1">Snacks Partner</p>
              <div className="flex items-center justify-center h-18 md:h-22 flex-1">
                <img alt="Snacks Partner" className="h-full w-auto object-contain" src="/cornitos.png" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help / Contact */}
      <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          {/* Desktop layout */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-gray-800">Need Help?</h3>
              <p className="text-gray-500 text-xs">Mon-Sat, 9 AM - 6 PM</p>
            </div>
            <div className="flex items-center gap-2.5">
              <a
                href="tel:+919321496142"
                className="flex items-center gap-2.5 bg-white hover:bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-xl transition-all group"
              >
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Call Us</p>
                  <p className="text-gray-800 font-semibold text-sm">+91 93214 96142</p>
                </div>
              </a>
              <a
                href="https://wa.me/919321496142?text=Hi, I need help with marathon registration"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 px-4 py-2.5 rounded-xl transition-all group"
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] text-emerald-100 font-medium">WhatsApp</p>
                  <p className="text-white font-semibold text-sm">Chat with us</p>
                </div>
              </a>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="sm:hidden">
            <div className="text-center mb-4">
              <h3 className="text-base font-bold text-gray-800">Need Help?</h3>
              <p className="text-gray-500 text-xs">Mon-Sat, 9 AM - 6 PM</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="tel:+919321496142"
                className="flex flex-col items-center gap-2 bg-white border border-gray-200 px-3 py-4 rounded-xl transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-gray-800 font-bold text-sm">Call Us</p>
                  <p className="text-gray-500 text-[11px]">+91 93214 96142</p>
                </div>
              </a>
              <a
                href="https://wa.me/919321496142?text=Hi, I need help with marathon registration"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 bg-emerald-500 px-3 py-4 rounded-xl transition-all active:scale-[0.98]"
              >
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-sm">WhatsApp</p>
                  <p className="text-emerald-100 text-[11px]">Chat with us</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
