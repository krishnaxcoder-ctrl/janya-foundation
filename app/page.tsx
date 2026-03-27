"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Menu, User, Zap, FileText, Users, MessageSquare, Bot, Clock, Globe, Shield, Search, Sparkles, Link, Settings } from "lucide-react"
import { useState, useEffect } from "react"

const sections = [
  { id: "knowledge", label: "KNOWLEDGE MANAGEMENT", color: "bg-orange-500" },
  { id: "response", label: "RESPONSE AUTOMATION", color: "bg-blue-500" },
  { id: "document", label: "DOCUMENT INTELLIGENCE", color: "bg-emerald-500" },
  { id: "collaboration", label: "COLLABORATION", color: "bg-violet-500" },
]

export default function Page() {
  const [activeSection, setActiveSection] = useState("knowledge")

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActiveSection(id)
              }
            })
          },
          {
            rootMargin: "-20% 0px -60% 0px",
            threshold: 0,
          }
        )
        observer.observe(element)
        observers.push(observer)
      }
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])
  return (
    <div className="min-h-screen bg-white overflow-x-clip">
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

      {/* Features Section */}
      <section className="max-w-7xl mx-auto border-l border-r border-gray-200 py-16 md:py-24 bg-white">
        <div className="flex gap-8 lg:gap-12 px-4 md:px-6 lg:px-12">
          {/* Left Sidebar - Sticky */}
          <div className="hidden lg:block w-[220px] shrink-0 relative">
            <div className="sticky top-20 pt-4">
              <nav className="flex flex-col gap-3">
                {sections.map(({ id, label, color }) => (
                  <a
                    key={id}
                    href={`#${id}`}
                    className={`flex items-center gap-2 text-sm whitespace-nowrap transition-colors ${
                      activeSection === id
                        ? "font-medium text-gray-900"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    {activeSection === id && (
                      <span className={`size-2 rounded-full ${color}`}></span>
                    )}
                    {label}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Content - Scrollable */}
          <div className="flex-1 space-y-24">

            {/* Knowledge Management */}
            <div id="knowledge">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-3xl font-medium tracking-tight text-gray-900">
                    Knowledge Management
                  </h2>
                  <p className="mt-2 text-xl md:text-xl text-gray-400 font-light">
                    Effortless knowledge, always accurate,
                    <br className="hidden md:block" />
                    always accessible
                  </p>
                </div>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors shrink-0">
                  Learn more <ArrowRight className="size-4" />
                </a>
              </div>

              <div className="rounded-2xl bg-stone-100 p-6 md:p-10 min-h-[300px] md:min-h-[400px] relative overflow-hidden">
                <div className="absolute right-6 md:right-10 top-1/4 flex flex-col gap-3">
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-orange-100">
                    <div className="size-6 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="size-3.5 text-orange-500" />
                    </div>
                    <span className="text-sm"><span className="text-orange-500 font-medium">Guest</span> Linda Johnson</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm ml-4">
                    <div className="size-6 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="size-3.5 text-gray-500" />
                    </div>
                    <span className="text-sm"><span className="text-gray-600 font-medium">Owner</span> Chris Carter</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-orange-100 ml-2">
                    <div className="size-6 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="size-3.5 text-orange-500" />
                    </div>
                    <span className="text-sm"><span className="text-orange-500 font-medium">Reviewer</span> James Wilson</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-orange-100 ml-6">
                    <div className="size-6 rounded-full bg-orange-100 flex items-center justify-center">
                      <User className="size-3.5 text-orange-500" />
                    </div>
                    <span className="text-sm"><span className="text-orange-500 font-medium">Editor</span> Mary Brown</span>
                  </div>
                </div>

                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 max-w-md">
                  <p className="text-gray-700">
                    <span className="font-semibold">Control ownership and access.</span>{" "}
                    <span className="text-gray-500">Define ownership, manage visibility, and ensure the right people see and update the right content.</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 mt-0 border-t border-stone-200">
                <button className="py-4 md:py-5 px-4 text-left text-sm text-gray-600 hover:bg-stone-50 transition-colors border-r border-stone-200">
                  Connect all your knowledge.
                </button>
                <button className="py-4 md:py-5 px-4 text-left text-sm text-gray-600 hover:bg-stone-50 transition-colors border-r border-stone-200">
                  Automate updates and upkeep.
                </button>
                <button className="py-4 md:py-5 px-4 text-left text-sm text-gray-600 hover:bg-stone-50 transition-colors border-r border-stone-200">
                  Translate and reuse across regions.
                </button>
                <button className="py-4 md:py-5 px-4 text-left text-sm bg-stone-800 text-white">
                  Control ownership and access.
                </button>
              </div>
            </div>

            {/* Response Automation */}
            <div id="response">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-3xl font-medium tracking-tight text-gray-900">
                    Response Automation
                  </h2>
                  <p className="mt-2 text-xl md:text-xl text-gray-400 font-light">
                    Instant answers, consistent quality,
                    <br className="hidden md:block" />
                    zero wait time
                  </p>
                </div>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors shrink-0">
                  Learn more <ArrowRight className="size-4" />
                </a>
              </div>

              <div className="rounded-2xl bg-blue-50 p-6 md:p-10 min-h-[300px] md:min-h-[400px] relative overflow-hidden">
                <div className="absolute right-6 md:right-10 top-1/4 flex flex-col gap-3 max-w-xs">
                  <div className="flex items-start gap-2 bg-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm border border-blue-100">
                    <Bot className="size-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">How can I help you today?</span>
                  </div>
                  <div className="flex items-start gap-2 bg-blue-500 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm ml-8">
                    <span className="text-sm text-white">I need to reset my password</span>
                  </div>
                  <div className="flex items-start gap-2 bg-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-sm border border-blue-100">
                    <Bot className="size-5 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">I'll send a reset link to your email right away!</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-blue-500 ml-2">
                    <Clock className="size-3" />
                    Response time: 0.3s
                  </div>
                </div>

                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 max-w-md">
                  <p className="text-gray-700">
                    <span className="font-semibold">AI-powered instant responses.</span>{" "}
                    <span className="text-gray-500">Deliver accurate answers in milliseconds with intelligent automation that learns and improves over time.</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 mt-0 border-t border-blue-100">
                <button className="py-4 md:py-5 px-4 text-left text-sm text-gray-600 hover:bg-blue-50 transition-colors border-r border-blue-100">
                  Smart routing and escalation.
                </button>
                <button className="py-4 md:py-5 px-4 text-left text-sm bg-blue-600 text-white">
                  Instant AI responses.
                </button>
                <button className="py-4 md:py-5 px-4 text-left text-sm text-gray-600 hover:bg-blue-50 transition-colors border-r border-blue-100">
                  Multi-channel support.
                </button>
                <button className="py-4 md:py-5 px-4 text-left text-sm text-gray-600 hover:bg-blue-50 transition-colors">
                  Sentiment analysis.
                </button>
              </div>
            </div>

            {/* Document Intelligence */}
            <div id="document">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-3xl font-medium tracking-tight text-gray-900">
                    Document Intelligence
                  </h2>
                  <p className="mt-2 text-xl md:text-xl text-gray-400 font-light">
                    Extract insights, automate processing,
                    <br className="hidden md:block" />
                    unlock your data
                  </p>
                </div>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors shrink-0">
                  Learn more <ArrowRight className="size-4" />
                </a>
              </div>

              <div className="rounded-2xl bg-emerald-50 p-6 md:p-10 min-h-[300px] md:min-h-[400px] relative overflow-hidden">
                <div className="absolute right-6 md:right-10 top-1/4 flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-emerald-100">
                    <FileText className="size-8 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Invoice_2024.pdf</p>
                      <p className="text-xs text-emerald-500">Extracted: $12,450.00</p>
                    </div>
                    <Sparkles className="size-4 text-emerald-400 ml-2" />
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-emerald-100 ml-4">
                    <FileText className="size-8 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contract_Draft.docx</p>
                      <p className="text-xs text-emerald-500">12 clauses identified</p>
                    </div>
                    <Sparkles className="size-4 text-emerald-400 ml-2" />
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-emerald-100 ml-2">
                    <Search className="size-8 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Smart Search</p>
                      <p className="text-xs text-emerald-500">Find anything instantly</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 max-w-md">
                  <p className="text-gray-700">
                    <span className="font-semibold">Intelligent document processing.</span>{" "}
                    <span className="text-gray-500">Automatically extract, classify, and analyze documents with AI that understands context and meaning.</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 mt-0 border-t border-emerald-100">
                <button className="py-4 md:py-5 px-4 text-left text-sm text-gray-600 hover:bg-emerald-50 transition-colors border-r border-emerald-100">
                  Auto-extract key data.
                </button>
                <button className="py-4 md:py-5 px-4 text-left text-sm text-gray-600 hover:bg-emerald-50 transition-colors border-r border-emerald-100">
                  Smart classification.
                </button>
                <button className="py-4 md:py-5 px-4 text-left text-sm bg-emerald-600 text-white">
                  Semantic search.
                </button>
                <button className="py-4 md:py-5 px-4 text-left text-sm text-gray-600 hover:bg-emerald-50 transition-colors">
                  Compliance checking.
                </button>
              </div>
            </div>

            {/* Collaboration */}
            <div id="collaboration">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl md:text-4xl lg:text-3xl font-medium tracking-tight text-gray-900">
                    Collaboration
                  </h2>
                  <p className="mt-2 text-xl md:text-xl text-gray-400 font-light">
                    Work together seamlessly,
                    <br className="hidden md:block" />
                    achieve more together
                  </p>
                </div>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors shrink-0">
                  Learn more <ArrowRight className="size-4" />
                </a>
              </div>

              <div className="rounded-2xl bg-violet-50 p-6 md:p-10 min-h-[300px] md:min-h-[400px] relative overflow-hidden">
                <div className="absolute right-6 md:right-10 top-1/4 flex flex-col gap-3">
                  <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-violet-100">
                    <div className="flex -space-x-2">
                      <div className="size-8 rounded-full bg-violet-200 border-2 border-white flex items-center justify-center text-xs font-medium text-violet-700">JD</div>
                      <div className="size-8 rounded-full bg-pink-200 border-2 border-white flex items-center justify-center text-xs font-medium text-pink-700">SK</div>
                      <div className="size-8 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-xs font-medium text-blue-700">MR</div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Product Team</p>
                      <p className="text-xs text-violet-500">3 members online</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-violet-100 ml-4">
                    <MessageSquare className="size-6 text-violet-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Real-time comments</p>
                      <p className="text-xs text-violet-500">12 new replies</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-violet-100 ml-2">
                    <Link className="size-6 text-violet-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Shared workspace</p>
                      <p className="text-xs text-violet-500">Connected & synced</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-6 md:bottom-10 left-6 md:left-10 max-w-md">
                  <p className="text-gray-700">
                    <span className="font-semibold">Unified team collaboration.</span>{" "}
                    <span className="text-gray-500">Bring teams together with shared workspaces, real-time updates, and seamless communication tools.</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 mt-0 border-t border-violet-100">
                <button className="py-4 md:py-5 px-4 text-left text-sm text-gray-600 hover:bg-violet-50 transition-colors border-r border-violet-100">
                  Shared workspaces.
                </button>
                <button className="py-4 md:py-5 px-4 text-left text-sm text-gray-600 hover:bg-violet-50 transition-colors border-r border-violet-100">
                  Real-time editing.
                </button>
                <button className="py-4 md:py-5 px-4 text-left text-sm text-gray-600 hover:bg-violet-50 transition-colors border-r border-violet-100">
                  Team analytics.
                </button>
                <button className="py-4 md:py-5 px-4 text-left text-sm bg-violet-600 text-white">
                  Seamless integrations.
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
