'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Generator', href: '/generator' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav className="text-white relative animate-slide-in-right-to-left">
      {/* Desktop */}
      <div className="hidden sm:flex items-center h-16 px-8">
        <Link href="/" className="text-2xl font-bold">
          ArchAi
        </Link>

        <div className="flex flex-1 justify-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative inline-block px-0.25 pb-0.5 group"
            >
              {item.name}
              <span
                className="
      absolute left-0 bottom-0 h-[1px] w-5 bg-white
      transition-all duration-300 ease-in-out
      group-hover:w-full"
              />
            </Link>
          ))}
        </div>
        <div style={{ width: 80 }} />
      </div>

      {/* Mobile */}
      <div className="sm:hidden flex items-center justify-between h-16 px-4">
        <Link href="/" className="text-2xl font-bold">
          ArchAi
        </Link>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          className="focus:outline-none"
        >
          {/* Hamburger Icon */}
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              // X icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              // Hamburger icon
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menü */}
      {isOpen && (
        <div className="sm:hidden absolute right-4 top-16 border border-gray-700 rounded shadow-lg py-2 w-40 z-50">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative block px-0.25 pb-0.5 m-2.5 group"
            >
              {item.name}
              <span
                className="
      absolute left-0 bottom-0 h-[1px] w-5 bg-white
      transition-all duration-300 ease-in-out
      group-hover:w-full"
              />
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
