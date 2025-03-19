import type { Metadata } from "next";
import "./globals.css";
import { NavigationMenu } from "@/components/ui/navigation-menu";

export const metadata: Metadata = {
  title: "Earth People LandCare",
  description: "Fruit Trees & Edible Plants - Grow your own food!",
};
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        {/* Header */}
        <header className="bg-green-800 text-white py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold">
              Earth People LandCare
            </h1>
            <p className="text-lg mt-2">
              Fruit Trees & Edible Plants - Grow your own food!
            </p>
          </div>
        </header>

        {/* Navigation */}
        <nav className="container mx-auto px-4 mt-4">
          <NavigationMenu />
        </nav>

        {/* Main Content */}
        <Toaster /> {/* This ensures all pages can show toasts */}

        <main className="container mx-auto px-4 py-8">{children}</main>

        {/* Footer */}
        <footer className="bg-green-800 text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} Earth People LandCare. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
