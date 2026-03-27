import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

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
      <section className="relative max-w-7xl mx-auto pt-20 md:pt-28 pb-20 md:pb-28 border-l border-r border-gray-200">
        <div className=" mx-auto px-6 lg:px-12 relative z-10 ">
          <h1 className="text-[2.75rem] md:text-[3.5rem] lg:text-[4rem] font-medium tracking-[-0.02em] text-gray-900 leading-[1.1]">
            Intelligent AI Bot Assistant
            <br />
            for Modern Businesses
          </h1>
          <p className="mt-8 text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed">
            Automate conversations, streamline operations, and deliver human-like
            support 24/7 with an AI assistant built to scale with your business.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 rounded-sm border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
            <Button className="rounded-sm bg-gray-900 text-white hover:bg-gray-800 h-12 w-12 p-0">
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>

      </section>

    </div>
  )
}
