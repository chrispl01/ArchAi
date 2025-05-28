'use client';

import Navbar from '@/components/Navbar';
import './globals.css';
import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        <main>{children}</main>
      </body>
    </html>
  );
}
