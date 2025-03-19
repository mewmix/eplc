"use client"; // Required for hooks like usePathname & useState

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Icons for hamburger menu

export function NavigationMenu() {
  const pathname = usePathname(); // Get the current page
  const [isOpen, setIsOpen] = useState(false); // Mobile menu toggle

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/blog", label: "Blog" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50 py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        
        {/* 🏡 Logo */}
        <Link href="/" className="text-green-800 font-bold text-xl">
          Earth People LandCare
        </Link>

        {/* 🖥️ Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {navItems
            .filter((item) => item.href !== pathname) // ✅ Hide current page
            .map((item) => (
              <Link key={item.href} href={item.href} className="text-green-800 font-semibold px-4 hover:underline">
                {item.label}
              </Link>
            ))}
        </div>

        {/* 📱 Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-green-800">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 📱 Mobile Navigation Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md absolute w-full left-0 top-full flex flex-col items-center space-y-4 py-4">
          {navItems
            .filter((item) => item.href !== pathname) // ✅ Hide current page
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-green-800 font-semibold text-lg"
                onClick={() => setIsOpen(false)} // Close menu on click
              >
                {item.label}
              </Link>
            ))}
        </div>
      )}
    </nav>
  );
}
