import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"
import { ApiProvider } from "../context/ApiContext"

export const metadata: Metadata = {
  title: "Health Dashboard",
  description: "Government Digital Health Portal",
  generator: "v0.app",
  icons: {
    icon: "https://5vpwugr172.ucarecd.net/b46d906e-fe6c-4eca-b9ef-75c1095be2f8/sehatsetulogo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} overflow-x-hidden`}>
        <ApiProvider>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Health Portal...</p>
              </div>
            </div>
          }>
            {children}
          </Suspense>
          <Analytics />
        </ApiProvider>
      </body>
    </html>
  )
}