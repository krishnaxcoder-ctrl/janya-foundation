import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Menu } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 max-w-7xl mx-auto border-l border-r border-gray-200">
        <div className="flex items-center justify-between px-4 md:px-6 lg:px-12 py-2">
          <div className="flex items-center gap-1.5">
            <span className="text-lg md:text-xl font-bold tracking-tight">ai.sek</span>
            <svg className="size-4 md:size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
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

          <Button className="hidden md:flex rounded-full bg-gray-900 text-white hover:bg-gray-800 px-6 h-10 text-sm font-medium">
            Get In Touch
          </Button>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
            <Menu className="size-6" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative max-w-7xl mx-auto pt-12 md:pt-28 pb-12 md:pb-28 border-l border-r border-gray-200 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      >
        <div className="mx-auto px-4 md:px-6 lg:px-12 relative z-10">
          <h1 className="text-3xl sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-medium tracking-[-0.02em] text-white leading-[1.1]">
            Intelligent AI Bot Assistant
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            for Modern Businesses
          </h1>
          <p className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-white/80 max-w-2xl leading-relaxed">
            Automate conversations, streamline operations, and deliver human-like
            support 24/7 with an AI assistant built to scale with your business.
          </p>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 max-w-md">
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" aria-hidden="true"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path><rect x="2" y="4" width="20" height="16" rx="2"></rect></svg>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-12 pl-12 pr-4 rounded-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
            </div>
            <Button className="rounded-sm bg-gray-900 text-white hover:bg-gray-800 h-12 w-full sm:w-12 p-0 flex items-center justify-center gap-2">
              <ArrowRight className="size-5" />
              <span className="sm:hidden">Get Started</span>
            </Button>
          </div>
        </div>

      </section>


    </div>
  )
}
