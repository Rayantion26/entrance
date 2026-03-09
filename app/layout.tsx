import type {Metadata} from 'next';
import Link from 'next/link';
import './globals.css'; // Global styles
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Smart Campus Access Control',
  description: 'A functional web-based prototype for a Smart Campus Access Control System demonstrating OOP principles.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 min-h-screen flex flex-col font-sans text-slate-900" suppressHydrationWarning>
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-600 font-semibold text-lg tracking-tight">
              <Shield className="w-6 h-6" />
              Smart Campus
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                Simulator
              </Link>
              <Link href="/admin" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                Admin Logs
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-12">
          {children}
        </main>
      </body>
    </html>
  );
}
