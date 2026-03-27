import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="flex items-center justify-between px-6 lg:px-12 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight">ai.sek</span>
            <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17L17 7M17 7H8M17 7V16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="hidden md:flex items-center gap-10 text-[15px] text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">How it Works</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Solution</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Pricing</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Resources</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Company</a>
          </div>

          <Button className="rounded-full bg-gray-900 text-white hover:bg-gray-800 px-6 h-10 text-sm font-medium">
            Get In Touch
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-28 pb-20 md:pb-28">
        <div className="max-w-4xl mx-auto text-center px-6 relative z-10">
          <h1 className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-medium tracking-[-0.02em] text-gray-900 leading-[1.1]">
            Intelligent AI Bot Assistant
            <br />
            for Modern Businesses
          </h1>
          <p className="mt-8 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Automate conversations, streamline operations, and deliver human-like
            support 24/7 with an AI assistant built to scale with your business.
          </p>
        </div>

      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 lg:px-12 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/60 p-8 md:p-14 border border-gray-100">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 mb-8">
                  <span className="size-2 rounded-full bg-gray-900"></span>
                  AI-Powered Automation
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-medium tracking-[-0.02em] text-gray-900 leading-[1.15]">
                  Transforming Communication
                  <br />
                  with Smart AI Assistance
                </h2>

                <p className="mt-6 text-gray-500 text-base md:text-lg leading-relaxed">
                  Our AI Bot Assistant combines natural language processing, machine learning,
                  and contextual understanding to deliver accurate, real-time responses across
                  multiple channels.
                </p>

                <Button className="mt-8 rounded-full bg-gray-900 text-white hover:bg-gray-800 px-8 h-12 text-sm font-medium">
                  Learn More
                </Button>
              </div>

              <div className="relative order-first md:order-last">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-50 via-violet-50 to-pink-50 border border-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-200/30 via-transparent to-pink-200/30" />
                  <div className="absolute bottom-0 right-0 w-3/4 h-3/4 bg-gradient-to-tl from-violet-200/40 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
