import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/ToastContext';
import { AuthProvider } from '@/components/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#2563eb',
};

export const metadata: Metadata = {
  title: 'ColonyGames 2026 – Annual Society Sports Fest',
  description:
    'Official tournament registration platform for Green Meadows Society Sports Fest. Cricket, Football, Hockey, Badminton, Table Tennis, 100m Sprint, Slow Cycling & more for 50+ families.',
  keywords: [
    'Society Sports Fest',
    'ColonyGames',
    'Sports Tournament Registration',
    'Society Cricket League',
    'Community Games',
  ],
  authors: [{ name: 'Green Meadows Sports Committee' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 w-full max-w-full overflow-x-clip flex flex-col min-w-0">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
