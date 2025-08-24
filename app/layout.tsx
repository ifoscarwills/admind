import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingChat } from "@/components/floating-chat"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ADMIND - AI-Powered Agency Solutions",
  description:
    "Transform your business with AI-driven growth strategies and cutting-edge marketing solutions. Get 300% average ROI increase with our proven AI technology.",
  keywords: [
    "AI marketing",
    "digital agency",
    "business growth",
    "AI solutions",
    "marketing automation",
    "ROI optimization",
  ],
  authors: [{ name: "ADMIND Team" }],
  creator: "ADMIND",
  publisher: "ADMIND",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://admind.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ADMIND - AI-Powered Agency Solutions",
    description: "Transform your business with AI-driven growth strategies and cutting-edge marketing solutions.",
    url: "/",
    siteName: "ADMIND",
    images: [
      {
        url: "/images/admind-logo.png",
        width: 1200,
        height: 630,
        alt: "ADMIND - AI-Powered Agency Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ADMIND - AI-Powered Agency Solutions",
    description: "Transform your business with AI-driven growth strategies and cutting-edge marketing solutions.",
    images: ["/images/admind-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/admind-logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#059669" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <FloatingChat />
        </ThemeProvider>
      </body>
    </html>
  )
}
