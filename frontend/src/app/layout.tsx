import { Navbar } from '@/components/Navbar';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="mx-4 sm:mx-8 flex min-h-[90vh]">{children}</main>
      </body>
    </html>
  );
}
