import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight">
             
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Transform Your Business with
            </span>
          </h2>

          {/* Subheadline */}
          <h3 className="text-xl sm:text-xl md:text-2xl lg:text-3xl text-gray-400 mb-4 sm:mb-6 font-semibold">
            AI-Driven Growth
          </h3>

          {/* Description */}
          <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            ADMIND combines cutting-edge AI technology with proven marketing strategies to accelerate your business
            growth and maximize profit.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-16 px-4 sm:px-0">
            <Link href="#contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </Link>
            <Link href="#services" className="w-full sm:w-auto">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-white hover:text-gray-200 px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl font-semibold"
              >
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
    </section>
  )
}
