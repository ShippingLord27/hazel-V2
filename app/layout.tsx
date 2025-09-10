import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AppProvider } from "@/contexts/AppContext"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ChatWidget } from "@/components/ChatWidget"
import { AuthModal } from "@/components/AuthModal"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "HAZEL: RENTAL ONLINE",
  description: "Your trusted rental marketplace for tools, equipment, and more",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AppProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <ChatWidget />
            <AuthModal />
          </Suspense>
        </AppProvider>
        <Analytics />
      </body>
    </html>
  )
}
