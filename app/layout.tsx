import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { Toaster } from "@/components/toaster"
import Script from 'next/script'; 
export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <head>
    <Script
           src="https://identity.netlify.com/v1/netlify-identity-widget.js"
           strategy="beforeInteractive">
    </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'
