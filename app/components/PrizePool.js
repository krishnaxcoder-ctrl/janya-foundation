'use client';

export default function PrizePool() {
  const features = [
    {
      title: 'Secure & Encrypted',
      desc: 'Your documents are protected with industry-standard encryption',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      title: '60-70 Days Processing',
      desc: 'Prize money credited after document verification',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      title: '24/7 Support',
      desc: 'Our team is always here to help you with any queries',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
    {
      title: 'Verified Winners',
      desc: 'Only verified marathon winners can claim prizes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: 'bg-amber-500',
    },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-white">
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/30 via-transparent to-rose-50/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          {/* Badge */}
          <div className="inline-flex flex-wrap items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2 mb-6 md:mb-8 bg-white rounded-full border border-amber-200 shadow-sm">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-orange-500">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3h14v2H5V3zm14 4v5c0 2.76-2.24 5-5 5h-1v2h3v2H8v-2h3v-2h-1c-2.76 0-5-2.24-5-5V7H2V3h4v4h12V3h4v4h-3zm-2 0H7v5c0 1.66 1.34 3 3 3h4c1.66 0 3-1.34 3-3V7z" />
              </svg>
            </div>
            <span className="text-xs sm:text-sm font-semibold text-amber-700">Janya Foundation Marathon 2026</span>
            <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-amber-200">
              <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Winners</span>
            </div>
          </div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-5 md:mb-6 max-w-4xl mx-auto leading-[1.15]">
            <span className="text-gray-900">Claim Your </span>
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">Prize Money</span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm md:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
            The prize claim submission window has now closed. Thank you to all our champions who participated in the Janya Foundation Marathon 2026.
          </p>

          {/* Closed Notice */}
          <div className="inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 border border-gray-200 px-8 py-4 text-base font-semibold text-gray-700 shadow-sm cursor-not-allowed">
            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Submission Time Has Ended</span>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {features.map((item, index) => (
            <div
              key={item.title}
              className="group relative bg-white rounded-xl p-4 sm:p-5 border border-gray-100 shadow-sm transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 hover:border-transparent overflow-hidden cursor-pointer"
            >
              {/* Animated gradient border on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl" />
              <div className="absolute inset-[2px] bg-white rounded-[10px] group-hover:bg-gray-50/95 transition-colors duration-300" />

              {/* Glowing orb effect */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-all duration-700 group-hover:scale-150" />

              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden rounded-xl">
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 ${item.color} rounded-lg flex items-center justify-center text-white mb-3 transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 group-hover:text-gray-800 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
